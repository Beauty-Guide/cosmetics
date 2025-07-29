package ru.cosmetic.server.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.cosmetic.server.dtos.Coordinates;
import ru.cosmetic.server.dtos.LocationData;
import ru.cosmetic.server.models.User;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Service
public class LocationService {
    private static final String CACHE_KEY = "userLocation";
    private static final int CACHE_EXPIRY_DAYS = 7;

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private UserService userService;

    public LocationData getLocation(HttpServletRequest request, String email) {
        // 1. Проверка кеша
        LocationData cached = getFromCache();
        if (cached != null) {
            return cached;
        }

        // 2. Проверка базы данных
        User user = userService.findByEmail(email);

        // 3. Попытка получить координаты из заголовков (если есть)
        try {
            String forwardedFor = request.getHeader("X-Forwarded-For");
            String ip = forwardedFor != null ? forwardedFor.split(",")[0] : request.getRemoteAddr();
            System.out.println("LOCATION: " + ip);

            // 4. Получение координат по IP
            Coordinates coords = getCoordinatesByIp(ip);
            System.out.println("COORDINATES: " + coords.toString());

            // 5. Получение информации о локации по координатам
            LocationData location = getLocationByCoords(coords);
            System.out.println("LOCATION: " + location.toString());
            saveToCache(location);
            return location;
        } catch (Exception e) {
            System.out.println("LOCATION: ERROR: " + e.getMessage());
            throw new RuntimeException("Failed to determine location", e);
        }
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

    public Coordinates getCoordinatesByIp(String ipAddress) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://ip-api.com/json/" + ipAddress + "?fields=status,message,country,regionName,city,lat,lon";

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (!"success".equals(response.get("status"))) {
            throw new RuntimeException((String) response.get("message"));
        }

        return new Coordinates((Double) response.get("lat"), (Double) response.get("lon"));
    }

    public LocationData getLocationByCoords(Coordinates coords) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + coords.getLat() + "&lon=" + coords.getLng() + "&zoom=18&addressdetails=1";

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || !"ok".equals(response.get("status"))) {
            throw new RuntimeException("Failed to get location data from Nominatim");
        }

        LocationData data = new LocationData();
        Map<String, Object> address = (Map<String, Object>) response.get("address");
        data.setCity((String) address.get("city"));
        data.setCountry((String) address.get("country"));
        data.setRegion((String) address.get("state"));
        data.setCoordinates(coords);
        data.setSource("nominatim");

        return data;
    }
}