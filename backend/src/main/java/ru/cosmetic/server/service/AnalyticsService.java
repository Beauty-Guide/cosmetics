package ru.cosmetic.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.dtos.*;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticAnalytic;
import ru.cosmetic.server.models.CosmeticMarketplaceLink;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.repo.AnalyticsRepo;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.utils.JwtTokenUtils;

import java.time.LocalDate;
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
        return CosmeticAnalytic.builder().cosmetic(request.getCosmeticId() != null ? new Cosmetic(request.getCosmeticId()) : null).user(user).action(request.getAction()).location(request.getLocation()).device(request.getDevice()).brandIds(request.getBrandIds()).actionIds(request.getActionIds()).skinTypeIds(request.getSkinTypeIds()).marketplaceLink(request.getMarketPlaceId() != null ? new CosmeticMarketplaceLink(request.getMarketPlaceId()) : null).query(request.getQuery()).build();
    }


    public List<AnalyticSearchFilterCountItem> countByBrand(LocalDate startDate, LocalDate endDate) {
        endDate = endDate.plusDays(1);
        String sql = """
                SELECT b.name AS label, COUNT(*) AS total_count
                FROM cosmetic_analytics ca
                JOIN analytics_brand_ids abi ON ca.id = abi.analytics_id
                JOIN brand b ON abi.brand_id = b.id
                WHERE DATE(ca.created_at) >= :startDate AND DATE(ca.created_at) <= :endDate
                GROUP BY b.name
                ORDER BY total_count DESC
                LIMIT 15
                """;
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> new AnalyticSearchFilterCountItem(rs.getString("label"), rs.getLong("total_count")));
    }

    public List<AnalyticSearchFilterCountItem> countBySkinType(LocalDate startDate, LocalDate endDate, String lang) {
        String sql = """
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
                WHERE DATE(ca.created_at) >= :startDate AND DATE(ca.created_at) <= :endDate
                GROUP BY label
                ORDER BY total_count DESC
                """;
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);
        params.addValue("lang", lang);
        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> new AnalyticSearchFilterCountItem(rs.getString("label"), rs.getLong("total_count")));
    }

    public List<AnalyticSearchFilterCountItem> countByAction(LocalDate startDate, LocalDate endDate, String lang) {
        String sql = """
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
                WHERE DATE(ca.created_at) >= :startDate AND DATE(ca.created_at) <= :endDate
                GROUP BY label
                ORDER BY total_count DESC
                """;
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);
        params.addValue("lang", lang);
        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> new AnalyticSearchFilterCountItem(rs.getString("label"), rs.getLong("total_count")));
    }

    public AnalyticSearchFilter getStatsSearchFilter(LocalDate startDate, LocalDate endDate, String lang) {
        return new AnalyticSearchFilter(countByBrand(startDate, endDate), countBySkinType(startDate, endDate, lang), countByAction(startDate, endDate, lang));
    }

    public List<AnalyticSearchFilterBrand> getBrandSearchAnalytics(LocalDate startDate, LocalDate endDate, String lang) {
        endDate = endDate.plusDays(1);
        String sqlSkinType = """
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
                WHERE ca.action = 'SEARCH_FILTER'
                    AND DATE(ca.created_at) >= :startDate
                    AND DATE(ca.created_at) <= :endDate
                GROUP BY b.id, b.name, st.id, st.name, st.name_en, st.name_kr
                ORDER BY count DESC;
                """;

        String sqlAction = """
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
                WHERE ca.action = 'SEARCH_FILTER'
                    AND DATE(ca.created_at) >= :startDate
                    AND DATE(ca.created_at) <= :endDate
                GROUP BY b.id, b.name, ca2.id, ca2.name, ca2.name_en, ca2.name_kr
                ORDER BY count DESC;
                """;

        String sqlQuery = """
                SELECT
                    b.id AS brand_id,
                    b.name AS brand_name,
                    ca.query AS search_query,
                    COUNT(*) AS count
                FROM cosmetic_analytics ca
                    JOIN analytics_brand_ids abi ON ca.id = abi.analytics_id
                    JOIN brand b ON abi.brand_id = b.id
                WHERE ca.action = 'SEARCH_FILTER'
                    AND DATE(ca.created_at) >= :startDate
                    AND DATE(ca.created_at) <= :endDate
                  AND ca.query IS NOT NULL
                GROUP BY b.id, b.name, ca.query
                ORDER BY count DESC;
                """;

        // Карта: brandName -> BrandSearchStats
        Map<String, AnalyticSearchFilterBrand> statsMap = new LinkedHashMap<>();
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);
        // 1. Обработка типов кожи
        namedParameterJdbcTemplate.query(sqlSkinType, params, (rs) -> {
            String skinTypeName;
            if ("en".equals(lang)) {
                skinTypeName = rs.getString("skin_type_name_en");
            } else if ("ko".equals(lang)) {
                skinTypeName = rs.getString("skin_type_name_kr");
            } else {
                skinTypeName = rs.getString("skin_type_name");
            }
            String brandName = rs.getString("brand_name");
            Long count = rs.getLong("count");

            AnalyticSearchFilterBrand stats = statsMap.computeIfAbsent(brandName, k -> {
                AnalyticSearchFilterBrand s = new AnalyticSearchFilterBrand();
                s.setBrand(brandName);
                return s;
            });

            stats.getSkinTypes().add(new AnalyticSearchFilterCountItem(skinTypeName, count));
        });

        // 2. Обработка действий
        namedParameterJdbcTemplate.query(sqlAction, params, (rs) -> {
            String brandName = rs.getString("brand_name");
            String actionName;
            if ("en".equals(lang)) {
                actionName = rs.getString("action_name_en");
            } else if ("ko".equals(lang)) {
                actionName = rs.getString("action_name_kr");
            } else {
                actionName = rs.getString("action_name");
            }
            Long count = rs.getLong("count");

            AnalyticSearchFilterBrand stats = statsMap.computeIfAbsent(brandName, k -> {
                AnalyticSearchFilterBrand s = new AnalyticSearchFilterBrand();
                s.setBrand(brandName);
                return s;
            });

            stats.getActions().add(new AnalyticSearchFilterCountItem(actionName, count));
        });

        // 3. Обработка поисковых запросов
        namedParameterJdbcTemplate.query(sqlQuery, params, (rs) -> {
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

        // Опционально: сортировка по количеству (по убыванию) внутри каждого списка
        statsMap.values().forEach(stats -> {
            stats.getSkinTypes().sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
            stats.getActions().sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
            stats.getQueries().sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
        });

        // Возвращаем результат
        return new ArrayList<>(statsMap.values());
    }

    public List<AnalyticProductViewCount> getAnalyticViewsDayAllProducts(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT DATE(ca.created_at) AS date, COUNT(ca.cosmetic_id) AS view_count
                FROM cosmetic_analytics ca
                WHERE ca.action = 'VIEW'
                  AND ca.created_at >= :startDate
                  AND ca.created_at < :endDate + INTERVAL '1 day'
                GROUP BY DATE(ca.created_at)
                ORDER BY date ASC
                """;

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> new AnalyticProductViewCount(rs.getDate("date").toLocalDate(), rs.getInt("view_count")));
    }

    public List<AnalyticViewedCosmetic> getTopViewedCosmetics(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT ca.cosmetic_id, c.name, COUNT(ca.cosmetic_id) AS view_count
                FROM cosmetic_analytics ca
                JOIN cosmetic c ON ca.cosmetic_id = c.id
                WHERE ca.action = 'VIEW'
                  AND ca.created_at >= :startDate
                  AND ca.created_at < :endDate + INTERVAL '1 day'
                GROUP BY ca.cosmetic_id, c.name
                ORDER BY view_count DESC
                LIMIT 10
                """;

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> new AnalyticViewedCosmetic(rs.getLong("cosmetic_id"), rs.getString("name"), rs.getInt("view_count")));
    }

    public Map<Long, List<AnalyticViewedCosmetic>> getViewedProducts(List<Long> cosmeticIds, LocalDate startDate, LocalDate endDate) {

        String baseSql = """
                
                            SELECT DATE(ca.created_at) AS date,
                                               ca.cosmetic_id,
                                               c.name,
                                               COUNT(ca.cosmetic_id) AS view_count
                                        FROM cosmetic_analytics ca
                                                 JOIN cosmetic c ON c.id = ca.cosmetic_id
                                        WHERE ca.action = 'VIEW'
                """;

        StringBuilder whereClause = new StringBuilder();
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

        String sql = baseSql + whereClause + """
                    GROUP BY DATE(ca.created_at), ca.cosmetic_id, c.name
                    ORDER BY ca.cosmetic_id, date ASC
                """;

        NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(this.jdbcTemplate);

        try {
            List<AnalyticViewedCosmetic> results = jdbcTemplate.query(sql, params, (rs, rowNum) -> new AnalyticViewedCosmetic(rs.getLong("cosmetic_id"), rs.getString("name"), rs.getInt("view_count"), rs.getDate("date").toLocalDate()));

            return results.stream().collect(Collectors.groupingBy(AnalyticViewedCosmetic::getCosmeticId));
        } catch (DataAccessException e) {
            throw new RuntimeException("Failed to fetch viewed products", e);
        }
    }

    public Map<Long, List<AnalyticClickCosmetic>> getClickCounts(List<Long> cosmeticIds, LocalDate startDate, LocalDate endDate) {
        String baseSql = """
        SELECT DATE(ca.created_at) AS date,
            cml.marketplace_name AS name,
            ca.cosmetic_id,
            ca.marketplace_link_id,
            COUNT(*) AS click_count
        FROM cosmetic_analytics ca
           JOIN cosmetic_marketplace_link cml ON ca.marketplace_link_id = cml.id
        
        WHERE ca.action = 'CLICK' AND cml.is_deleted = false
    """;

        StringBuilder whereClause = new StringBuilder();
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

        String sql = baseSql + whereClause + """
        GROUP BY DATE(ca.created_at),cml.marketplace_name, ca.cosmetic_id, ca.marketplace_link_id
        ORDER BY click_count DESC
    """;

        NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(this.jdbcTemplate);

        try {
            List<AnalyticClickCosmetic> results = jdbcTemplate.query(sql, params, (rs, rowNum) -> new AnalyticClickCosmetic(
                    rs.getLong("cosmetic_id"),
                    rs.getString("name"),
                    rs.getInt("click_count"),
                    rs.getDate("date").toLocalDate()));

            return results.stream().collect(Collectors.groupingBy(AnalyticClickCosmetic::getCosmeticId));
        } catch (DataAccessException e) {
            throw new RuntimeException("Failed to fetch viewed products", e);
        }
    }
}
