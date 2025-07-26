package ru.cosmetic.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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

import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.*;

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
                .user(user)
                .action(request.getAction())
                .location(request.getLocation())
                .device(request.getDevice())
                .brandIds(request.getBrandIds())
                .actionIds(request.getActionIds())
                .skinTypeIds(request.getSkinTypeIds())
                .marketplaceLink(request.getMarketPlaceId() != null ? new CosmeticMarketplaceLink(request.getMarketPlaceId()) : null)
                .query(request.getQuery())
                .build();
    }


    public List<AnalyticSearchFilterCountItem> countByBrand(LocalDate startDate, LocalDate endDate) {
        String sql = """
        SELECT b.name AS label, COUNT(*) AS total_count
        FROM cosmetic_analytics ca
        JOIN analytics_brand_ids abi ON ca.id = abi.analytics_id
        JOIN brand b ON abi.brand_id = b.id
        WHERE DATE(ca.created_at) >= :startDate AND DATE(ca.created_at) <= (:endDate + INTERVAL '1 day')
        GROUP BY b.name
        ORDER BY total_count DESC
        LIMIT 15
        """;
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        return namedParameterJdbcTemplate.query(
                sql,
                params,
                (rs, rowNum) -> new AnalyticSearchFilterCountItem(rs.getString("label"), rs.getLong("total_count"))
        );
    }

    public List<AnalyticSearchFilterCountItem> countBySkinType(LocalDate startDate, LocalDate endDate) {
        String sql = """
        SELECT st.name AS label, COUNT(*) AS total_count
        FROM cosmetic_analytics ca
        JOIN analytics_skin_type_ids asti ON ca.id = asti.analytics_id
        JOIN skin_type st ON asti.skin_type_id = st.id
        WHERE DATE(ca.created_at) >= :startDate AND DATE(ca.created_at) <= (:endDate + INTERVAL '1 day')
        GROUP BY st.name
        ORDER BY total_count DESC
        """;
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        return namedParameterJdbcTemplate.query(
                sql,
                params,
                (rs, rowNum) -> new AnalyticSearchFilterCountItem(rs.getString("label"), rs.getLong("total_count"))
        );
    }

    public List<AnalyticSearchFilterCountItem> countByAction(LocalDate startDate, LocalDate endDate) {
        String sql = """
        SELECT cact.name AS label, COUNT(*) AS total_count
        FROM cosmetic_analytics ca
        JOIN analytics_action_ids aai ON ca.id = aai.analytics_id
        JOIN cosmetic_action cact ON aai.action_id = cact.id
        WHERE DATE(ca.created_at) >= :startDate AND DATE(ca.created_at) <= (:endDate + INTERVAL '1 day')
        GROUP BY cact.name
        ORDER BY total_count DESC
        """;
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        return namedParameterJdbcTemplate.query(
                sql,
                params,
                (rs, rowNum) -> new AnalyticSearchFilterCountItem(rs.getString("label"), rs.getLong("total_count"))
        );
    }

    public AnalyticSearchFilter getStatsSearchFilter(LocalDate startDate, LocalDate endDate) {
        return new AnalyticSearchFilter(
                countByBrand(startDate, endDate),
                countBySkinType(startDate, endDate),
                countByAction(startDate, endDate)
        );
    }

    public  List<AnalyticSearchFilterBrand> getBrandSearchAnalytics(LocalDate startDate, LocalDate endDate) {

        String sqlSkinType = """
        SELECT
            b.id AS brand_id,
            b.name AS brand_name,
            st.name AS skin_type_name,
            COUNT(*) AS count
        FROM cosmetic_analytics ca
            JOIN analytics_brand_ids abi ON ca.id = abi.analytics_id
            JOIN brand b ON abi.brand_id = b.id
            JOIN analytics_skin_type_ids asti ON ca.id = asti.analytics_id
            JOIN skin_type st ON asti.skin_type_id = st.id
        WHERE ca.action = 'SEARCH_FILTER'
            AND DATE(ca.created_at) >= :startDate
            AND DATE(ca.created_at) <= (:endDate + INTERVAL '1 day')
        GROUP BY b.id, b.name, st.id, st.name
        ORDER BY count DESC;
        """;

        String sqlAction = """
        SELECT
            b.id AS brand_id,
            b.name AS brand_name,
            ca2.name AS action_name,
            COUNT(*) AS count
        FROM cosmetic_analytics ca
            JOIN analytics_brand_ids abi ON ca.id = abi.analytics_id
            JOIN brand b ON abi.brand_id = b.id
            JOIN analytics_action_ids aai ON ca.id = aai.analytics_id
            JOIN cosmetic_action ca2 ON ca2.id = aai.action_id
        WHERE ca.action = 'SEARCH_FILTER'
            AND DATE(ca.created_at) >= :startDate
            AND DATE(ca.created_at) <= (:endDate + INTERVAL '1 day')
        GROUP BY b.id, b.name, ca2.id, ca2.name
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
            AND DATE(ca.created_at) <= (:endDate + INTERVAL '1 day')
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
            String brandName = rs.getString("brand_name");
            String skinTypeName = rs.getString("skin_type_name");
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
            String actionName = rs.getString("action_name");
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

}
