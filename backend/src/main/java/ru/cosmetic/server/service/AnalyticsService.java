package ru.cosmetic.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.dtos.*;
import ru.cosmetic.server.models.*;
import ru.cosmetic.server.repo.AnalyticsRepo;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.utils.JwtTokenUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsRepo analyticsRepo;
    private final JwtTokenUtils jwtTokenUtils;
    private final UserService userService;
    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public void save(AnalyticsRequest request, String authHeader) {
        User user = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtTokenUtils.extractUserName(token);
                user = userService.findByEmail(email);
            } catch (Exception e) {
                // токен некорректный или истёк — считаем гостем
            }
        }
        CosmeticAnalytic analytic = buildAnalytic(request, user);
        analyticsRepo.save(analytic);
    }

    @Transactional
    public void save(AnalyticsRequest request, User user) {
        CosmeticAnalytic analytic = buildAnalytic(request, user);
        analyticsRepo.save(analytic);
    }

    @Transactional
    public void save(CosmeticAnalytic analytic) {
        analyticsRepo.save(analytic);
    }

    private CosmeticAnalytic buildAnalytic(AnalyticsRequest request, User user) {
        return CosmeticAnalytic.builder()
                .cosmetic(request.getCosmeticId() != null ? new Cosmetic(request.getCosmeticId()) : null)
                .cosmeticBag(request.getCosmeticBagId() != null ? CosmeticBag.builder().id(request.getCosmeticBagId()).build() : null)
                .user(user).action(request.getAction())
                .location(request.getLocation())
                .device(request.getDevice())
                .brandIds(request.getBrandIds())
                .createdAt(LocalDateTime.now())
                .actionIds(request.getActionIds())
                .skinTypeIds(request.getSkinTypeIds())
                .marketplaceLink(request.getMarketPlaceId() != null ? new CosmeticMarketplaceLink(request.getMarketPlaceId()) : null)
                .query(request.getQuery())
                .build();
    }


    public List<AnalyticSearchFilterCountItem> countByBrand(LocalDate startDate, LocalDate endDate, String countryId) {
        StringBuilder sql = new StringBuilder("""
        SELECT b.name AS label, COUNT(*) AS total_count
        FROM cosmetic_analytics ca
        JOIN analytics_brand_ids abi ON ca.id = abi.analytics_id
        JOIN brand b ON abi.brand_id = b.id
        """);

        // Добавляем JOIN для фильтрации по стране
        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            sql.append("""
            JOIN locations l ON ca.location_id = l.id
            JOIN countries co ON l.country_id = co.id
            """);
        }

        sql.append("""
        WHERE DATE(ca.created_at) >= :startDate AND DATE(ca.created_at) <= :endDate
        """);

        // Фильтр по стране
        if (countryId != null && !countryId.equals("all")) {
            if (countryId.equals("withoutLocation")) {
                sql.append(" AND ca.location_id IS NULL");
            } else {
                sql.append(" AND co.id = CAST(:countryId AS bigint)");
            }
        }

        sql.append(" GROUP BY b.name ORDER BY total_count DESC LIMIT 15");

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate.plusDays(1));

        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            params.addValue("countryId", countryId);
        }

        return namedParameterJdbcTemplate.query(sql.toString(), params,
                (rs, rowNum) -> new AnalyticSearchFilterCountItem(rs.getString("label"), rs.getLong("total_count")));
    }

    public List<AnalyticSearchFilterCountItem> countBySkinType(LocalDate startDate, LocalDate endDate, String lang, String countryId) {
        StringBuilder sql = new StringBuilder("""
        SELECT 
            CASE 
                WHEN :lang = 'en' THEN st.name_en
                WHEN :lang = 'ko' THEN st.name_kr
                ELSE st.name
            END AS label, 
            COUNT(*) AS total_count
        FROM cosmetic_analytics ca
        JOIN analytics_skin_type_ids asti ON ca.id = asti.analytics_id
        JOIN skin_type st ON asti.skin_type_id = st.id
        """);

        // Добавляем JOIN для фильтрации по стране
        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            sql.append("""
            JOIN locations l ON ca.location_id = l.id
            JOIN countries co ON l.country_id = co.id
            """);
        }

        sql.append("""
        WHERE DATE(ca.created_at) >= :startDate AND DATE(ca.created_at) <= :endDate
        """);

        // Фильтр по стране
        if (countryId != null && !countryId.equals("all")) {
            if (countryId.equals("withoutLocation")) {
                sql.append(" AND ca.location_id IS NULL");
            } else {
                sql.append(" AND co.id = CAST(:countryId AS bigint)");
            }
        }

        sql.append(" GROUP BY label ORDER BY total_count DESC");

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);
        params.addValue("lang", lang);

        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            params.addValue("countryId", countryId);
        }

        return namedParameterJdbcTemplate.query(sql.toString(), params,
                (rs, rowNum) -> new AnalyticSearchFilterCountItem(rs.getString("label"), rs.getLong("total_count")));
    }

    public List<AnalyticSearchFilterCountItem> countByAction(LocalDate startDate, LocalDate endDate, String lang, String countryId) {
        StringBuilder sql = new StringBuilder("""
        SELECT 
            CASE 
                WHEN :lang = 'en' THEN cact.name_en
                WHEN :lang = 'ko' THEN cact.name_kr
                ELSE cact.name
            END AS label, 
            COUNT(*) AS total_count
        FROM cosmetic_analytics ca
        JOIN analytics_action_ids aai ON ca.id = aai.analytics_id
        JOIN cosmetic_action cact ON aai.action_id = cact.id
        """);

        // Добавляем JOIN для фильтрации по стране
        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            sql.append("""
            JOIN locations l ON ca.location_id = l.id
            JOIN countries co ON l.country_id = co.id
            """);
        }

        sql.append("""
        WHERE DATE(ca.created_at) >= :startDate AND DATE(ca.created_at) <= :endDate
        """);

        // Фильтр по стране
        if (countryId != null && !countryId.equals("all")) {
            if (countryId.equals("withoutLocation")) {
                sql.append(" AND ca.location_id IS NULL");
            } else {
                sql.append(" AND co.id = CAST(:countryId AS bigint)");
            }
        }

        sql.append(" GROUP BY label ORDER BY total_count DESC");

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);
        params.addValue("lang", lang);

        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            params.addValue("countryId", countryId);
        }

        return namedParameterJdbcTemplate.query(sql.toString(), params,
                (rs, rowNum) -> new AnalyticSearchFilterCountItem(rs.getString("label"), rs.getLong("total_count")));
    }

    public AnalyticSearchFilter getStatsSearchFilter(LocalDate startDate, LocalDate endDate, String lang, String countryId) {
        return new AnalyticSearchFilter(
                countByBrand(startDate, endDate, countryId),
                countBySkinType(startDate, endDate, lang, countryId),
                countByAction(startDate, endDate, lang, countryId));
    }

    public List<AnalyticSearchFilterBrand> getBrandSearchAnalytics(LocalDate startDate,
                                                                   LocalDate endDate,
                                                                   String lang,
                                                                   String countryId) {
        endDate = endDate.plusDays(1);

        // Базовые SQL-запросы
        StringBuilder sqlSkinType = new StringBuilder("""
        SELECT
            b.id AS brand_id,
            b.name AS brand_name,
            st.name AS skin_type_name,
            st.name_en AS skin_type_name_en,
            st.name_kr AS skin_type_name_kr,
            COUNT(*) AS count
        FROM cosmetic_analytics ca
            JOIN analytics_brand_ids abi ON ca.id = abi.analytics_id
            JOIN brand b ON abi.brand_id = b.id
            JOIN analytics_skin_type_ids asti ON ca.id = asti.analytics_id
            JOIN skin_type st ON asti.skin_type_id = st.id
        """);

        StringBuilder sqlAction = new StringBuilder("""
        SELECT
            b.id AS brand_id,
            b.name AS brand_name,
            ca2.name AS action_name,
            ca2.name_en AS action_name_en,
            ca2.name_kr AS action_name_kr,
            COUNT(*) AS count
        FROM cosmetic_analytics ca
            JOIN analytics_brand_ids abi ON ca.id = abi.analytics_id
            JOIN brand b ON abi.brand_id = b.id
            JOIN analytics_action_ids aai ON ca.id = aai.analytics_id
            JOIN cosmetic_action ca2 ON ca2.id = aai.action_id
        """);

        StringBuilder sqlQuery = new StringBuilder("""
        SELECT
            b.id AS brand_id,
            b.name AS brand_name,
            ca.query AS search_query,
            COUNT(*) AS count
        FROM cosmetic_analytics ca
            JOIN analytics_brand_ids abi ON ca.id = abi.analytics_id
            JOIN brand b ON abi.brand_id = b.id
        """);

        // Добавляем JOIN для фильтрации по стране, если нужно
        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            String countryJoin = """
            JOIN locations l ON ca.location_id = l.id
            JOIN countries co ON l.country_id = co.id
            """;
            sqlSkinType.append(countryJoin);
            sqlAction.append(countryJoin);
            sqlQuery.append(countryJoin);
        }

        // Добавляем WHERE условия
        sqlSkinType.append("""
        WHERE ca.action = 'SEARCH_FILTER'
            AND DATE(ca.created_at) >= :startDate
            AND DATE(ca.created_at) <= :endDate
        """);

        sqlAction.append("""
        WHERE ca.action = 'SEARCH_FILTER'
            AND DATE(ca.created_at) >= :startDate
            AND DATE(ca.created_at) <= :endDate
        """);

        sqlQuery.append("""
        WHERE ca.action = 'SEARCH_FILTER'
            AND DATE(ca.created_at) >= :startDate
            AND DATE(ca.created_at) <= :endDate
            AND ca.query IS NOT NULL
        """);

        // Добавляем фильтрацию по стране для всех запросов
        if (countryId != null && !countryId.equals("all")) {
            String countryCondition = countryId.equals("withoutLocation")
                    ? " AND ca.location_id IS NULL"
                    : " AND co.id = CAST(:countryId AS bigint)";

            sqlSkinType.append(countryCondition);
            sqlAction.append(countryCondition);
            sqlQuery.append(countryCondition);
        }

        // Завершаем SQL-запросы
        sqlSkinType.append(" GROUP BY b.id, b.name, st.id, st.name, st.name_en, st.name_kr ORDER BY count DESC;");
        sqlAction.append(" GROUP BY b.id, b.name, ca2.id, ca2.name, ca2.name_en, ca2.name_kr ORDER BY count DESC;");
        sqlQuery.append(" GROUP BY b.id, b.name, ca.query ORDER BY count DESC;");

        // Остальная часть метода остается без изменений
        Map<String, AnalyticSearchFilterBrand> statsMap = new LinkedHashMap<>();
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            params.addValue("countryId", countryId);
        }

        // Обработка результатов
        namedParameterJdbcTemplate.query(sqlSkinType.toString(), params, (rs) -> {
            String skinTypeName = getLocalizedName(rs, "skin_type_name", "skin_type_name_en", "skin_type_name_kr", lang);
            String brandName = rs.getString("brand_name");
            Long count = rs.getLong("count");

            AnalyticSearchFilterBrand stats = statsMap.computeIfAbsent(brandName, k -> {
                AnalyticSearchFilterBrand s = new AnalyticSearchFilterBrand();
                s.setBrand(brandName);
                return s;
            });

            stats.getSkinTypes().add(new AnalyticSearchFilterCountItem(skinTypeName, count));
        });

        namedParameterJdbcTemplate.query(sqlAction.toString(), params, (rs) -> {
            String actionName = getLocalizedName(rs, "action_name", "action_name_en", "action_name_kr", lang);
            String brandName = rs.getString("brand_name");
            Long count = rs.getLong("count");

            AnalyticSearchFilterBrand stats = statsMap.computeIfAbsent(brandName, k -> {
                AnalyticSearchFilterBrand s = new AnalyticSearchFilterBrand();
                s.setBrand(brandName);
                return s;
            });

            stats.getActions().add(new AnalyticSearchFilterCountItem(actionName, count));
        });

        namedParameterJdbcTemplate.query(sqlQuery.toString(), params, (rs) -> {
            String brandName = rs.getString("brand_name");
            String query = rs.getString("search_query");
            Long count = rs.getLong("count");

            AnalyticSearchFilterBrand stats = statsMap.computeIfAbsent(brandName, k -> {
                AnalyticSearchFilterBrand s = new AnalyticSearchFilterBrand();
                s.setBrand(brandName);
                return s;
            });

            stats.getQueries().add(new AnalyticSearchFilterCountItem(query, count));
        });

        // Сортировка результатов
        statsMap.values().forEach(stats -> {
            stats.getSkinTypes().sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
            stats.getActions().sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
            stats.getQueries().sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
        });

        return new ArrayList<>(statsMap.values());
    }

    private String getLocalizedName(ResultSet rs, String nameField, String nameEnField, String nameKrField, String lang)
            throws SQLException {
        if ("en".equals(lang)) {
            return rs.getString(nameEnField);
        } else if ("ko".equals(lang)) {
            return rs.getString(nameKrField);
        }
        return rs.getString(nameField);
    }

    public List<AnalyticProductViewCount> getAnalyticViewsDayAllProducts(LocalDate startDate, LocalDate endDate, String countryId) {
        // Определяем SQL-запрос в зависимости от значения countryId
        String sql;
        if (countryId == null || countryId.equals("all")) {
            sql = """
            SELECT DATE(ca.created_at) AS date, COUNT(ca.cosmetic_id) AS view_count
            FROM cosmetic_analytics ca
            WHERE ca.action = 'VIEW'
              AND ca.created_at >= :startDate
              AND ca.created_at < :endDate + INTERVAL '1 day'
            GROUP BY DATE(ca.created_at)
            ORDER BY date ASC
            """;
        } else if (countryId.equals("withoutLocation")) {
            sql = """
            SELECT DATE(ca.created_at) AS date, COUNT(ca.cosmetic_id) AS view_count
            FROM cosmetic_analytics ca
            WHERE ca.action = 'VIEW'
              AND ca.created_at >= :startDate
              AND ca.created_at < :endDate + INTERVAL '1 day'
              AND ca.location_id IS NULL
            GROUP BY DATE(ca.created_at)
            ORDER BY date ASC
            """;
        } else {
            sql = """
            SELECT DATE(ca.created_at) AS date, COUNT(ca.cosmetic_id) AS view_count
            FROM cosmetic_analytics ca
            JOIN locations l ON ca.location_id = l.id
            JOIN countries c ON l.country_id = c.id
            WHERE ca.action = 'VIEW'
              AND ca.created_at >= :startDate
              AND ca.created_at < :endDate + INTERVAL '1 day'
              AND c.id = CAST(:countryId AS bigint)
            GROUP BY DATE(ca.created_at)
            ORDER BY date ASC
            """;
        }

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        // Добавляем countryId только если это конкретная страна
        if (!(countryId == null || countryId.equals("all") || countryId.equals("withoutLocation"))) {
            params.addValue("countryId", countryId);
        }

        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) ->
                new AnalyticProductViewCount(rs.getDate("date").toLocalDate(), rs.getInt("view_count")));
    }

    public List<AnalyticViewedCosmetic> getTopViewedCosmetics(LocalDate startDate, LocalDate endDate, String countryId) {
        StringBuilder fromClause = new StringBuilder("""
        FROM cosmetic_analytics ca
        JOIN cosmetic c ON ca.cosmetic_id = c.id
        """);

        StringBuilder whereClause = new StringBuilder("""
        WHERE ca.action = 'VIEW'
          AND ca.created_at >= :startDate
          AND ca.created_at < :endDate + INTERVAL '1 day'
        """);

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        // Добавляем условия для фильтрации по стране
        if (countryId != null && !countryId.equals("all")) {
            if (countryId.equals("withoutLocation")) {
                whereClause.append(" AND ca.location_id IS NULL");
            } else {
                fromClause.append("""
                JOIN locations l ON ca.location_id = l.id
                JOIN countries co ON l.country_id = co.id
                """);
                whereClause.append(" AND co.id = CAST(:countryId AS bigint)");
                params.addValue("countryId", countryId);
            }
        }

        String sql = """
        SELECT ca.cosmetic_id, c.name, COUNT(ca.cosmetic_id) AS view_count
        """ + fromClause + whereClause + " GROUP BY ca.cosmetic_id, c.name ORDER BY view_count DESC LIMIT 10";

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);

        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) ->
                new AnalyticViewedCosmetic(
                        rs.getLong("cosmetic_id"),
                        rs.getString("name"),
                        rs.getInt("view_count")
                )
        );
    }

    public Map<Long, List<AnalyticViewedCosmetic>> getViewedProducts(List<Long> cosmeticIds,
                                                                     LocalDate startDate,
                                                                     LocalDate endDate,
                                                                     String countryId) {
        StringBuilder fromClause = new StringBuilder("""
        FROM cosmetic_analytics ca
        JOIN cosmetic c ON c.id = ca.cosmetic_id
        """);
        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            fromClause.append("""
            JOIN locations l ON ca.location_id = l.id
            JOIN countries co ON l.country_id = co.id
            """);
        }
        StringBuilder whereClause = new StringBuilder("WHERE ca.action = 'VIEW'");
        MapSqlParameterSource params = new MapSqlParameterSource();
        if (cosmeticIds != null && !cosmeticIds.isEmpty()) {
            whereClause.append(" AND ca.cosmetic_id IN (:cosmeticIds)");
            params.addValue("cosmeticIds", cosmeticIds);
        }
        if (startDate != null) {
            whereClause.append(" AND ca.created_at >= :startDate");
            params.addValue("startDate", startDate.atStartOfDay());
        }
        if (endDate != null) {
            whereClause.append(" AND ca.created_at < :endDate");
            params.addValue("endDate", endDate.plusDays(1).atStartOfDay());
        }
        if (countryId != null && !countryId.equals("all")) {
            if (countryId.equals("withoutLocation")) {
                whereClause.append(" AND ca.location_id IS NULL");
            } else {
                whereClause.append(" AND co.id = CAST(:countryId AS bigint)");
                params.addValue("countryId", countryId);
            }
        }
        String sql = """
        SELECT DATE(ca.created_at) AS date,
               ca.cosmetic_id,
               c.name,
               COUNT(ca.cosmetic_id) AS view_count
        """ + fromClause + whereClause + " GROUP BY DATE(ca.created_at), ca.cosmetic_id, c.name ORDER BY ca.cosmetic_id, date ASC";

        NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(this.jdbcTemplate);

        try {
            List<AnalyticViewedCosmetic> results = jdbcTemplate.query(sql, params, (rs, rowNum) ->
                    new AnalyticViewedCosmetic(
                            rs.getLong("cosmetic_id"),
                            rs.getString("name"),
                            rs.getInt("view_count"),
                            rs.getDate("date").toLocalDate()
                    ));

            return results.stream()
                    .collect(Collectors.groupingBy(AnalyticViewedCosmetic::getCosmeticId));
        } catch (DataAccessException e) {
            throw new RuntimeException("Failed to fetch viewed products", e);
        }
    }

    public Map<Long, List<AnalyticClickCosmetic>> getClickCounts(List<Long> cosmeticIds,
                                                                 LocalDate startDate,
                                                                 LocalDate endDate,
                                                                 String countryId) {
        StringBuilder fromClause = new StringBuilder("""
        FROM cosmetic_analytics ca
        JOIN cosmetic_marketplace_link cml ON ca.marketplace_link_id = cml.id
        """);
        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            fromClause.append("""
            JOIN locations l ON ca.location_id = l.id
            JOIN countries co ON l.country_id = co.id
            """);
        }
        StringBuilder whereClause = new StringBuilder("WHERE ca.action = 'CLICK' AND cml.is_deleted = false");
        MapSqlParameterSource params = new MapSqlParameterSource();
        if (cosmeticIds != null && !cosmeticIds.isEmpty()) {
            whereClause.append(" AND ca.cosmetic_id IN (:cosmeticIds)");
            params.addValue("cosmeticIds", cosmeticIds);
        }
        if (startDate != null) {
            whereClause.append(" AND ca.created_at >= :startDate");
            params.addValue("startDate", startDate.atStartOfDay());
        }
        if (endDate != null) {
            whereClause.append(" AND ca.created_at < :endDate");
            params.addValue("endDate", endDate.plusDays(1).atStartOfDay());
        }
        if (countryId != null && !countryId.equals("all")) {
            if (countryId.equals("withoutLocation")) {
                whereClause.append(" AND ca.location_id IS NULL");
            } else {
                whereClause.append(" AND co.id = CAST(:countryId AS bigint)");
                params.addValue("countryId", countryId);
            }
        }
        String sql = """
        SELECT DATE(ca.created_at) AS date,
               cml.marketplace_name AS name,
               ca.cosmetic_id,
               ca.marketplace_link_id,
               COUNT(*) AS click_count
        """ + fromClause + whereClause + " GROUP BY DATE(ca.created_at), cml.marketplace_name, ca.cosmetic_id, ca.marketplace_link_id ORDER BY click_count DESC";

        NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(this.jdbcTemplate);

        try {
            List<AnalyticClickCosmetic> results = jdbcTemplate.query(sql, params, (rs, rowNum) ->
                    new AnalyticClickCosmetic(
                            rs.getLong("cosmetic_id"),
                            rs.getString("name"),
                            rs.getInt("click_count"),
                            rs.getDate("date").toLocalDate()
                    ));

            return results.stream()
                    .collect(Collectors.groupingBy(AnalyticClickCosmetic::getCosmeticId));
        } catch (DataAccessException e) {
            throw new RuntimeException("Failed to fetch click counts", e);
        }
    }

    public List<AnalyticFavoriteCosmeticCount> getTopFavoriteCosmetics(LocalDate startDate,
                                                                       LocalDate endDate,
                                                                       String countryId) {
        // Базовый SQL
        StringBuilder sql = new StringBuilder("""
        SELECT c.id, c.name, COUNT(ca.cosmetic_id) AS favorite_count
        FROM cosmetic_analytics ca
        JOIN cosmetic c ON ca.cosmetic_id = c.id
        """);

        // Добавляем JOIN для фильтрации по стране при необходимости
        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            sql.append("""
            JOIN locations l ON ca.location_id = l.id
            JOIN countries co ON l.country_id = co.id
            """);
        }

        // Начинаем WHERE условия
        sql.append(" WHERE ca.action = 'FAV'");
        MapSqlParameterSource params = new MapSqlParameterSource();

        // Фильтр по датам
        if (startDate != null) {
            sql.append(" AND ca.created_at >= :startDate");
            params.addValue("startDate", startDate.atStartOfDay());
        }
        if (endDate != null) {
            sql.append(" AND ca.created_at < :endDate");
            params.addValue("endDate", endDate.plusDays(1).atStartOfDay());
        }

        // Фильтр по стране
        if (countryId != null && !countryId.equals("all")) {
            if (countryId.equals("withoutLocation")) {
                sql.append(" AND ca.location_id IS NULL");
            } else {
                sql.append(" AND co.id = CAST(:countryId AS bigint)");
                params.addValue("countryId", countryId);
            }
        }

        // Завершаем запрос
        sql.append(" GROUP BY c.id, c.name ORDER BY favorite_count DESC LIMIT 15");

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);

        return namedParameterJdbcTemplate.query(
                sql.toString(),
                params,
                (rs, rowNum) -> new AnalyticFavoriteCosmeticCount(
                        rs.getString("name"),
                        rs.getInt("favorite_count")
                )
        );
    }

    public List<AnalyticFavoriteCosmeticBagCount> getTopFavoriteCosmeticCosmeticBags(LocalDate startDate,
                                                                       LocalDate endDate,
                                                                       String countryId) {
        // Базовый SQL
        StringBuilder sql = new StringBuilder("""
        SELECT c.id, c.name, u.username, COUNT(ca.cosmetic_bag_id) AS favorite_count
        FROM cosmetic_analytics ca
        JOIN cosmetic_bag c ON ca.cosmetic_bag_id = c.id
        JOIN users u on c.owner_id = u.id
        """);

        // Добавляем JOIN для фильтрации по стране при необходимости
        if (countryId != null && !countryId.equals("all") && !countryId.equals("withoutLocation")) {
            sql.append("""
            JOIN locations l ON ca.location_id = l.id
            JOIN countries co ON l.country_id = co.id
            """);
        }

        // Начинаем WHERE условия
        sql.append(" WHERE ca.action = 'FAV_BAG'");
        MapSqlParameterSource params = new MapSqlParameterSource();

        // Фильтр по датам
        if (startDate != null) {
            sql.append(" AND ca.created_at >= :startDate");
            params.addValue("startDate", startDate.atStartOfDay());
        }
        if (endDate != null) {
            sql.append(" AND ca.created_at < :endDate");
            params.addValue("endDate", endDate.plusDays(1).atStartOfDay());
        }

        // Фильтр по стране
        if (countryId != null && !countryId.equals("all")) {
            if (countryId.equals("withoutLocation")) {
                sql.append(" AND ca.location_id IS NULL");
            } else {
                sql.append(" AND co.id = CAST(:countryId AS bigint)");
                params.addValue("countryId", countryId);
            }
        }

        // Завершаем запрос
        sql.append(" GROUP BY c.id, c.name, u.username ORDER BY favorite_count DESC LIMIT 15");

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);

        return namedParameterJdbcTemplate.query(
                sql.toString(),
                params,
                (rs, rowNum) -> new AnalyticFavoriteCosmeticBagCount(
                        rs.getString("name"),
                        rs.getString("username"),
                        rs.getInt("favorite_count")
                )
        );
    }
}
