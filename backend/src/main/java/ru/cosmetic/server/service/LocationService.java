package ru.cosmetic.server.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.cosmetic.server.dtos.Coordinates;
import ru.cosmetic.server.dtos.LocationData;
import ru.cosmetic.server.models.City;
import ru.cosmetic.server.models.Country;
import ru.cosmetic.server.models.Location;
import ru.cosmetic.server.repo.CityRepo;
import ru.cosmetic.server.repo.CountryRepo;
import ru.cosmetic.server.repo.LocationRepo;
import ru.cosmetic.server.requestDto.CityRequest;
import ru.cosmetic.server.requestDto.CountryRequest;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LocationService {
    private static final String CACHE_KEY = "userLocation";
    private static final int CACHE_EXPIRY_DAYS = 7;

    private final CacheManager cacheManager;
    private final LocationRepo locationRepo;
    private final JdbcTemplate jdbcTemplate;
    private final CountryRepo countryRepo;
    private final CityRepo cityRepo;

    public Location findByCountryAndCity(String countryName, String cityName) {
        String sql = """
                SELECT l.id AS location_id, 
                       c.id AS city_id, c.name_ru AS city_name_ru, c.name_en AS city_name_en,
                       co.id AS country_id, co.name_ru AS country_name_ru, co.name_en AS country_name_en
                FROM locations l
                JOIN cities c ON l.city_id = c.id
                JOIN countries co ON l.country_id = co.id
                WHERE (co.name_ru = ? OR co.name_en = ?) 
                  AND (c.name_ru = ? OR c.name_en = ?)
                LIMIT 1""";

        return jdbcTemplate.query(sql,
                ps -> {
                    ps.setString(1, countryName);
                    ps.setString(2, countryName);
                    ps.setString(3, cityName);
                    ps.setString(4, cityName);
                },
                rs -> {
                    if (rs.next()) {
                        Country country = Country.builder()
                                .id(rs.getLong("country_id"))
                                .nameRU(rs.getString("country_name_ru"))
                                .nameEN(rs.getString("country_name_en"))
                                .build();

                        City city = City.builder()
                                .id(rs.getLong("city_id"))
                                .nameRU(rs.getString("city_name_ru"))
                                .nameEN(rs.getString("city_name_en"))
                                .country(country)
                                .build();

                        return Location.builder()
                                .id(rs.getLong("location_id"))
                                .city(city)
                                .country(country)
                                .build();
                    }
                    return null;
                });
    }

    public List<Location> findAll() {
        String sql = """
                SELECT l.id AS location_id, 
                       c.id AS city_id, c.name_ru AS city_name_ru, c.name_en AS city_name_en,
                       co.id AS country_id, co.name_ru AS country_name_ru, co.name_en AS country_name_en
                FROM locations l
                JOIN cities c ON l.city_id = c.id
                JOIN countries co ON l.country_id = co.id""";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Country country = Country.builder()
                    .id(rs.getLong("country_id"))
                    .nameRU(rs.getString("country_name_ru"))
                    .nameEN(rs.getString("country_name_en"))
                    .build();

            City city = City.builder()
                    .id(rs.getLong("city_id"))
                    .nameRU(rs.getString("city_name_ru"))
                    .nameEN(rs.getString("city_name_en"))
                    .country(country)
                    .build();

            return Location.builder()
                    .id(rs.getLong("location_id"))
                    .city(city)
                    .country(country)
                    .build();
        });
    }

    public List<CountryRequest> getCountriesWithCities(String lang) {
        boolean langIsRu = lang != null && lang.equals("ru");
        String countryNameField = langIsRu ? "co.name_ru" : "co.name_en";
        String cityNameField = langIsRu ? "c.name_ru" : "c.name_en";

        String sql = String.format("""
                        SELECT co.id AS country_id, %s AS country_name, 
                               c.id AS city_id, %s AS city_name
                        FROM countries co
                        JOIN cities c ON co.id = c.country_id
                        ORDER BY %s, %s""",
                countryNameField, cityNameField, countryNameField, cityNameField);

        return jdbcTemplate.query(sql, (rs) -> {
            Map<Long, CountryRequest> countryMap = new LinkedHashMap<>();

            while (rs.next()) {
                Long countryId = rs.getLong("country_id");
                String countryName = rs.getString("country_name");
                Long cityId = rs.getLong("city_id");
                String cityName = rs.getString("city_name");

                CountryRequest country = countryMap.computeIfAbsent(countryId, k -> {
                    CountryRequest cr = new CountryRequest();
                    cr.setId(countryId);
                    cr.setName(countryName);
                    cr.setCities(new ArrayList<>());
                    return cr;
                });

                CityRequest city = new CityRequest();
                city.setId(cityId);
                city.setName(cityName);
                country.getCities().add(city);
            }

            return new ArrayList<>(countryMap.values());
        });
    }

    @Transactional
    public Location save(Location location) {
        Country country = countryRepo.findByNameRU(location.getCountry().getNameRU());
        if (country == null) {
            country = Country.builder().nameRU(location.getCountry().getNameRU()).nameEN(location.getCountry().getNameEN()).build();
            country = countryRepo.save(country);
            location.setCountry(country);
        } else {
            location.getCity().setCountry(country);
            location.setCountry(country);
        }
        City city = cityRepo.findByNameRU(location.getCity().getNameRU());
        if (city == null) {
            city = cityRepo.save(location.getCity());
            location.setCity(city);
        } else {
            location.setCity(city);
        }
        Location findLocation = locationRepo.findByCountryAndCity(country, city);
        return Objects.requireNonNullElseGet(findLocation, () -> locationRepo.save(location));
    }

    public Location getLocation(HttpServletRequest request) {
        LocationData cached = getFromCache();
        if (cached != null) {
            return buildLocation(cached);
        }
        try {
            String forwardedFor = request.getHeader("X-Forwarded-For");
            String ip = forwardedFor != null ? forwardedFor.split(",")[0] : request.getRemoteAddr();
            // ip = "109.252.45.21";
            LocationData location = getLocationByIp(ip);

            Location buildLocation = buildLocation(location);
            buildLocation = save(buildLocation);
            location.setLocationId(buildLocation.getId());
            location.setCityId(buildLocation.getCity().getId());
            location.setCountryId(buildLocation.getCountry().getId());
            saveToCache(location);
            return buildLocation;
        } catch (Exception e) {
            throw new RuntimeException("Failed to determine location", e);
        }
    }


    private Location buildLocation(LocationData locationData) {
        Country country = Country.builder()
                .id(locationData.getCountryId())
                .nameRU(locationData.getCountryRu())
                .nameEN(locationData.getCountryEn())
                .build();
        City city = City.builder()
                .id(locationData.getCityId())
                .nameRU(locationData.getCityRu())
                .nameEN(locationData.getCityEn())
                .country(country)
                .build();
        return Location.builder()
                .id(locationData.getLocationId())
                .city(city)
                .country(country)
                .build();
    }

    private LocationData getFromCache() {
        Cache cache = cacheManager.getCache(CACHE_KEY);
        if (cache != null) {
            Cache.ValueWrapper wrapper = cache.get(CACHE_KEY);
            if (wrapper != null) {
                LocationData cached = (LocationData) wrapper.get();
                if (cached != null && cached.getTimestamp() != null) {
                    Instant expiryDate = Instant.ofEpochMilli(cached.getTimestamp())
                            .plus(CACHE_EXPIRY_DAYS, ChronoUnit.DAYS);
                    if (Instant.now().isBefore(expiryDate)) {
                        return cached;
                    }
                }
            }
        }
        return null;
    }

    private void saveToCache(LocationData data) {
        data.setTimestamp(System.currentTimeMillis());
        Cache cache = cacheManager.getCache(CACHE_KEY);
        if (cache != null) {
            cache.put(CACHE_KEY, data);
        }
    }

    public LocationData getLocationByIp(String ipAddress) {
        RestTemplate restTemplate = new RestTemplate();
        String urlRu = "http://ip-api.com/json/" + ipAddress + "?fields=status,message,country,regionName,city,lat,lon&lang=ru";
        String urlEn = "http://ip-api.com/json/" + ipAddress + "?fields=status,message,country,regionName,city,lat,lon&lang=en";

        Map<String, Object> responseRu = restTemplate.getForObject(urlRu, Map.class);
        Map<String, Object> responseEn = restTemplate.getForObject(urlEn, Map.class);

        if (!"success".equals(responseRu.get("status")) || !"success".equals(responseEn.get("status"))) {
            throw new RuntimeException("Failed to get location data: " +
                    responseRu.getOrDefault("message", responseEn.get("message")));
        }

        LocationData data = new LocationData();
        // Русские названия
        data.setCityRu((String) responseRu.get("city"));
        data.setCountryRu((String) responseRu.get("country"));
        data.setRegionRu((String) responseRu.get("regionName"));

        // Английские названия
        data.setCityEn((String) responseEn.get("city"));
        data.setCountryEn((String) responseEn.get("country"));
        data.setRegionEn((String) responseEn.get("regionName"));

        // Координаты (берем из любого ответа, так как они одинаковые)
        data.setCoordinates(new Coordinates(
                (Double) responseRu.get("lat"),
                (Double) responseRu.get("lon")
        ));
        data.setSource("ip");

        return data;
    }
}