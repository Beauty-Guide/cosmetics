package ru.cosmetic.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.postgresql.jdbc.PgArray;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.models.UserSearchHistory;
import ru.cosmetic.server.repo.CosmeticImageRepo;
import ru.cosmetic.server.repo.CosmeticMarketplaceLinkRepo;
import ru.cosmetic.server.repo.CosmeticRepo;
import ru.cosmetic.server.repo.FavoriteCosmeticRepo;
import ru.cosmetic.server.requestDto.CosmeticFilterRequest;
import ru.cosmetic.server.responseDto.*;

import java.sql.SQLException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CosmeticService {

    private final CosmeticRepo cosmeticRepo;
    private final CosmeticImageRepo cosmeticImageRepo;
    private final FavoriteCosmeticRepo favoriteCosmeticRepo;
    private final UserSearchHistoryService userSearchHistoryService;
    private final UserService userService;
    private final CosmeticMarketplaceLinkRepo cosmeticMarketplaceLinkRepo;
    private final JdbcTemplate jdbcTemplate;
    private final String IMAGE_URL = "/api/getFile?cosmeticId=%s&fileName=%s";

    public Cosmetic save(Cosmetic cosmetic) {
        return cosmeticRepo.save(cosmetic);
    }

    public Cosmetic findById(Long id) {
        return cosmeticRepo.findById(id).orElse(null);
    }

    public List<Cosmetic> getAllCosmetics() {
        return cosmeticRepo.findAll();
    }

    public Long getCountOfCosmetics() {
        return cosmeticRepo.count();
    }

    public List<Cosmetic> findAll() {
        return cosmeticRepo.findAll();
    }

    public CosmeticResponse getCosmeticById(Long id, String lang, boolean isAllData) {
        String sql = """
        SELECT
            c.id                                           AS cosmetic_id,
            c.name                                         AS cosmetic_name,
            c.compatibility,
            c.compatibility_en,
            c.compatibility_kr,
            c.usage_recommendations,
            c.usage_recommendations_en,
            c.usage_recommendations_kr,
            c.application_method,
            c.application_method_en,
            c.application_method_kr,
            c.rating,
            b.id                                           AS brand_id,
            b.name                                         AS brand_name,
            cat.id                                         AS catalog_id,
            cat.name                                       AS catalog_name,
            cat.name_en                                    AS catalog_name_en,
            cat.name_kr                                    AS catalog_name_ko,
            EXISTS (SELECT 1 FROM catalog sub WHERE sub.parent_id = cat.id) AS has_children,

            /* actions */
            array_agg(DISTINCT a.id)            FILTER (WHERE a.id IS NOT NULL) AS action_ids,
            array_agg(DISTINCT a.name)          FILTER (WHERE a.id IS NOT NULL) AS action_names,
            array_agg(DISTINCT a.name_en)       FILTER (WHERE a.id IS NOT NULL) AS action_names_en,
            array_agg(DISTINCT a.name_kr)       FILTER (WHERE a.id IS NOT NULL) AS action_names_ko,

            /* skin types */
            array_agg(DISTINCT st.id)           FILTER (WHERE st.id IS NOT NULL) AS skin_type_ids,
            array_agg(DISTINCT st.name)         FILTER (WHERE st.id IS NOT NULL) AS skin_type_names,
            array_agg(DISTINCT st.name_en)      FILTER (WHERE st.id IS NOT NULL) AS skin_type_names_en,
            array_agg(DISTINCT st.name_kr)      FILTER (WHERE st.id IS NOT NULL) AS skin_type_names_ko,

            /* ingredients */
            array_agg(DISTINCT i.id)            FILTER (WHERE i.id IS NOT NULL) AS ingredient_ids,
            array_agg(DISTINCT i.name)          FILTER (WHERE i.id IS NOT NULL) AS ingredient_names,

            /* images */
            array_agg(DISTINCT img.id)          FILTER (WHERE img.id IS NOT NULL) AS image_ids,
            array_agg(DISTINCT img.url)         FILTER (WHERE img.id IS NOT NULL) AS image_urls,
            array_agg(DISTINCT img.is_main)     FILTER (WHERE img.id IS NOT NULL) AS image_is_main,

            /* marketplace links */
            array_agg(DISTINCT cml.id)          FILTER (WHERE cml.id IS NOT NULL) AS marketplace_ids,
            array_agg(DISTINCT cml.marketplace_name)
                                               FILTER (WHERE cml.id IS NOT NULL) AS marketplace_names,
            array_agg(DISTINCT cml.location)    FILTER (WHERE cml.id IS NOT NULL) AS marketplace_locations,
            array_agg(DISTINCT cml.product_link)
                                               FILTER (WHERE cml.id IS NOT NULL) AS marketplace_product_links
        FROM cosmetic c
        JOIN brand      b   ON b.id   = c.brand_id
        JOIN catalog    cat ON cat.id = c.catalog_id
        LEFT JOIN cosmetic_cosmetic_action cca ON cca.cosmetic_id = c.id
        LEFT JOIN cosmetic_action          a   ON a.id   = cca.action_id
        LEFT JOIN cosmetic_skin_type       cst ON cst.cosmetic_id = c.id
        LEFT JOIN skin_type                st  ON st.id  = cst.skin_type_id
        LEFT JOIN cosmetic_ingredient      ci  ON ci.cosmetic_id = c.id
        LEFT JOIN ingredient               i   ON i.id   = ci.ingredient_id
        LEFT JOIN cosmetic_image           img ON img.cosmetic_id = c.id
        LEFT JOIN cosmetic_marketplace_link cml ON cml.cosmetic_id = c.id
        WHERE c.id = ?
        GROUP BY c.id, b.id, cat.id
        """;

        try {
            Map<String, Object> row = jdbcTemplate.queryForMap(sql, id);
            return mapRowToCosmeticResponse(row, lang, isAllData);
        } catch (EmptyResultDataAccessException ex) {
            return new CosmeticResponse();
        }
    }

    public CosmeticsResponse getCosmeticsByFilters(CosmeticFilterRequest filter, String lang, User user, boolean isAllData) {
        List<Object> params = new ArrayList<>();
        boolean isFavoriteJoinNeeded = filter.isByFavourite();
        StringBuilder sql = new StringBuilder("""
        SELECT
            c.id                                           AS cosmetic_id,
            c.name                                         AS cosmetic_name,
            c.compatibility,
            c.compatibility_en,
            c.compatibility_kr,
            c.usage_recommendations,
            c.usage_recommendations_en,
            c.usage_recommendations_kr,
            c.application_method,
            c.application_method_en,
            c.application_method_kr,
            c.rating,
            b.id                                           AS brand_id,
            b.name                                         AS brand_name,
            cat.id                                         AS catalog_id,
            cat.name                                       AS catalog_name,
            cat.name_en                                    AS catalog_name_en,
            cat.name_kr                                    AS catalog_name_ko,
            EXISTS (SELECT 1 FROM catalog sub WHERE sub.parent_id = cat.id) AS has_children,

            /* агрегация вместо коррелированных подзапросов */
            array_agg(DISTINCT a.id)                    FILTER (WHERE a.id IS NOT NULL) AS action_ids,
            array_agg(DISTINCT a.name)                  FILTER (WHERE a.id IS NOT NULL) AS action_names,
            array_agg(DISTINCT a.name_en)               FILTER (WHERE a.id IS NOT NULL) AS action_names_en,
            array_agg(DISTINCT a.name_kr)               FILTER (WHERE a.id IS NOT NULL) AS action_names_ko,
            array_agg(DISTINCT st.id)                   FILTER (WHERE st.id IS NOT NULL) AS skin_type_ids,
            array_agg(DISTINCT st.name)                 FILTER (WHERE st.id IS NOT NULL) AS skin_type_names,
            array_agg(DISTINCT st.name_en)              FILTER (WHERE st.id IS NOT NULL) AS skin_type_names_en,
            array_agg(DISTINCT st.name_kr)              FILTER (WHERE st.id IS NOT NULL) AS skin_type_names_ko,
            array_agg(DISTINCT i.id)                    FILTER (WHERE i.id IS NOT NULL) AS ingredient_ids,
            array_agg(DISTINCT i.name)                  FILTER (WHERE i.id IS NOT NULL) AS ingredient_names,
            array_agg(DISTINCT img.id)                  FILTER (WHERE img.id IS NOT NULL) AS image_ids,
            array_agg(DISTINCT img.url)                 FILTER (WHERE img.id IS NOT NULL) AS image_urls,
            array_agg(DISTINCT img.is_main)             FILTER (WHERE img.id IS NOT NULL) AS image_is_main,
            array_agg(DISTINCT cml.id)                  FILTER (WHERE cml.id IS NOT NULL) AS marketplace_ids,
            array_agg(DISTINCT cml.marketplace_name)    FILTER (WHERE cml.id IS NOT NULL) AS marketplace_names,
            array_agg(DISTINCT cml.location)            FILTER (WHERE cml.id IS NOT NULL) AS marketplace_locations,
            array_agg(DISTINCT cml.product_link)        FILTER (WHERE cml.id IS NOT NULL) AS marketplace_product_links
        """);
        if (isFavoriteJoinNeeded) {
            sql.append(", COALESCE(fav.cnt,0) AS favorite_count");
        }
        sql.append("""
        FROM cosmetic c
        JOIN brand      b   ON b.id = c.brand_id
        JOIN catalog    cat ON cat.id = c.catalog_id
        LEFT JOIN cosmetic_cosmetic_action cca ON cca.cosmetic_id = c.id
        LEFT JOIN cosmetic_action          a   ON a.id = cca.action_id
        LEFT JOIN cosmetic_skin_type       cst ON cst.cosmetic_id = c.id
        LEFT JOIN skin_type                st  ON st.id = cst.skin_type_id
        LEFT JOIN cosmetic_ingredient      ci  ON ci.cosmetic_id = c.id
        LEFT JOIN ingredient               i   ON i.id = ci.ingredient_id
        LEFT JOIN cosmetic_image           img ON img.cosmetic_id = c.id
        LEFT JOIN cosmetic_marketplace_link cml ON cml.cosmetic_id = c.id
        """);
        if (isFavoriteJoinNeeded) {
            sql.append("""
            LEFT JOIN LATERAL (
                SELECT cosmetic_id, COUNT(*) AS cnt
                FROM favorite_cosmetics
                GROUP BY cosmetic_id
            ) fav ON fav.cosmetic_id = c.id
            """);
        }
        sql.append(buildWhereClause(filter, params, user));
        sql.append(" GROUP BY c.id, b.id, cat.id");
        if (isFavoriteJoinNeeded) sql.append(", fav.cnt");
        sql.append(" ORDER BY ");
        if (filter.isByPopularity()) {
            sql.append("COALESCE(c.rating,0) DESC");
        } else if (filter.isByDate()) {
            sql.append("c.created_date DESC");
        } else if (filter.isByFavourite()) {
            sql.append("COALESCE(fav.cnt,0) DESC, c.rating, c.id");
        } else if ("name".equalsIgnoreCase(filter.getSortBy())) {
            sql.append("c.name ").append(
                    "desc".equalsIgnoreCase(filter.getSortDirection()) ? "DESC" : "ASC");
        } else {
            sql.append("c.id");
        }

        sql.append(" LIMIT ?");
        params.add(filter.getSize());
        sql.append(" OFFSET ?");
        params.add(filter.getPage() * filter.getSize());

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql.toString(), params.toArray());
        List<CosmeticResponse> cosmeticResponses = groupCosmeticResponses(rows, lang, isAllData);
        CosmeticsResponse response = new CosmeticsResponse();
        response.setCosmetics(cosmeticResponses);
        response.setTotal(getCountOfCosmetics(filter)); // при желании замените на total из окна
        return response;
    }

    public CosmeticsResponse getCosmeticsForCatalogByFilters(CosmeticFilterRequest filter, String lang, User user, boolean isAllData) {
        List<Object> params = new ArrayList<>();
        boolean isFavoriteJoinNeeded = filter.isByFavourite();
        StringBuilder sql = new StringBuilder("""
        SELECT
            c.id                                           AS cosmetic_id,
            c.name                                         AS cosmetic_name,
            c.compatibility,
            c.usage_recommendations,
            c.application_method,
            c.rating,
            b.name                                         AS brand_name,
            EXISTS (SELECT 1 FROM catalog sub WHERE sub.parent_id = cat.id) AS has_children,

            /* агрегация вместо коррелированных подзапросов */
            array_agg(DISTINCT img.id)                  FILTER (WHERE img.id IS NOT NULL) AS image_ids,
            array_agg(DISTINCT img.url)                 FILTER (WHERE img.id IS NOT NULL) AS image_urls,
            array_agg(DISTINCT img.is_main)             FILTER (WHERE img.id IS NOT NULL) AS image_is_main

        """);
        if (isFavoriteJoinNeeded) {
            sql.append(", COALESCE(fav.cnt,0) AS favorite_count ");
        }
        sql.append("""
        FROM cosmetic c
        JOIN brand      b   ON b.id = c.brand_id
        JOIN catalog    cat ON cat.id = c.catalog_id
        LEFT JOIN cosmetic_cosmetic_action cca ON cca.cosmetic_id = c.id
        LEFT JOIN cosmetic_action          a   ON a.id = cca.action_id
        LEFT JOIN cosmetic_skin_type       cst ON cst.cosmetic_id = c.id
        LEFT JOIN skin_type                st  ON st.id = cst.skin_type_id
        LEFT JOIN cosmetic_image           img ON img.cosmetic_id = c.id
        """);
        if (isFavoriteJoinNeeded) {
            sql.append("""
            LEFT JOIN LATERAL (
                SELECT cosmetic_id, COUNT(*) AS cnt
                FROM favorite_cosmetics
                GROUP BY cosmetic_id
            ) fav ON fav.cosmetic_id = c.id
            """);
        }
        sql.append(buildWhereClause(filter, params, user));
        sql.append(" GROUP BY c.id, b.id, cat.id");
        if (isFavoriteJoinNeeded) sql.append(", fav.cnt");
        sql.append(" ORDER BY ");
        if (filter.isByPopularity()) {
            sql.append("COALESCE(c.rating,0) DESC");
        } else if (filter.isByDate()) {
            sql.append("c.created_date DESC");
        } else if (filter.isByFavourite()) {
            sql.append("COALESCE(fav.cnt,0) DESC, c.rating, c.id");
        } else if ("name".equalsIgnoreCase(filter.getSortBy())) {
            sql.append("c.name ").append(
                    "desc".equalsIgnoreCase(filter.getSortDirection()) ? "DESC" : "ASC");
        } else {
            sql.append("c.id");
        }

        sql.append(" LIMIT ?");
        params.add(filter.getSize());
        sql.append(" OFFSET ?");
        params.add(filter.getPage() * filter.getSize());

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql.toString(), params.toArray());
        List<CosmeticResponse> cosmeticResponses = groupCosmeticResponses(rows, lang, isAllData);
        CosmeticsResponse response = new CosmeticsResponse();
        response.setCosmetics(cosmeticResponses);
        response.setTotal(getCountOfCosmetics(filter)); // при желании замените на total из окна
        return response;
    }

    public CosmeticsResponse getCosmeticsForTableByFilters(CosmeticFilterRequest filter, String lang, User user, boolean isAllData) {
        List<Object> params = new ArrayList<>();
        StringBuilder sql = new StringBuilder("""
        SELECT
            c.id AS cosmetic_id,
            c.name AS cosmetic_name,
            c.rating,
            b.name AS brand_name,
            cat.name AS catalog_name,
            fav.favorite_count,
            (SELECT EXISTS (
                SELECT 1 FROM catalog sub_cat WHERE sub_cat.parent_id = cat.id
            )) AS has_children""");


        sql.append("""
        FROM cosmetic c
        JOIN brand b ON c.brand_id = b.id
        JOIN catalog cat ON c.catalog_id = cat.id
        LEFT JOIN (SELECT cosmetic_id, COUNT(*) AS favorite_count FROM favorite_cosmetics GROUP BY cosmetic_id) fav ON c.id = fav.cosmetic_id

    
    """);

        // Добавляем WHERE часть
        sql.append(buildWhereClause(filter, params, user));

        // GROUP BY
        sql.append(" GROUP BY c.id, b.id, cat.id, fav.favorite_count");

        // ORDER BY
        sql.append(" ORDER BY ");
        if (filter.isByPopularity()) {
            sql.append("COALESCE(c.rating, 0) DESC");
        } else if (filter.isByDate()) {
            sql.append("c.created_date DESC");
        } else if (filter.isByFavourite()) {
            sql.append("COALESCE(fav.favorite_count, 0) DESC, c.rating, c.id ASC");
        } else if ("name".equalsIgnoreCase(filter.getSortBy())) {
            sql.append("c.name ");
            String dir = "desc".equalsIgnoreCase(filter.getSortDirection()) ? "DESC" : "ASC";
            sql.append(dir);
        } else {
            sql.append("c.id ASC");
        }

        // Пагинация
        sql.append(" LIMIT ? OFFSET ?");
        params.add(filter.getSize());
        params.add(filter.getPage() * filter.getSize());

        // Выполняем запрос
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql.toString(), params.toArray());

        List<CosmeticResponse> cosmeticResponses = groupCosmeticResponses(rows, lang, isAllData);
        CosmeticsResponse cosmeticsResponse = new CosmeticsResponse();
        cosmeticsResponse.setCosmetics(cosmeticResponses);
        cosmeticsResponse.setTotal(getCountOfCosmetics(filter));

        return cosmeticsResponse;
    }

    private int getCountOfCosmetics(CosmeticFilterRequest filter) {
        List<Object> countParams = new ArrayList<>();
        String whereClause = buildWhereClause(filter, countParams, null);

        String countSql = "SELECT COUNT(DISTINCT c.id) FROM cosmetic c " +
                "JOIN brand b ON c.brand_id = b.id " +
                "JOIN catalog cat ON c.catalog_id = cat.id " +
                "LEFT JOIN cosmetic_cosmetic_action cca ON c.id = cca.cosmetic_id " +
                "LEFT JOIN cosmetic_action a ON cca.action_id = a.id " +
                "LEFT JOIN cosmetic_skin_type cst ON c.id = cst.cosmetic_id " +
                "LEFT JOIN skin_type st ON cst.skin_type_id = st.id " +
                "LEFT JOIN cosmetic_ingredient ci ON c.id = ci.cosmetic_id " +
                "LEFT JOIN ingredient i ON ci.ingredient_id = i.id " +
                whereClause;

        return jdbcTemplate.queryForObject(countSql, Integer.class, countParams.toArray());
    }

    public List<Long> getAllChildIdsRecursively(Long parentId) {
        String sql = """
        WITH RECURSIVE catalog_tree AS (
            SELECT id FROM catalog WHERE parent_id = ?
            UNION ALL
            SELECT c.id FROM catalog c
            INNER JOIN catalog_tree t ON c.parent_id = t.id
        )
        SELECT id FROM catalog_tree;
    """;

        return jdbcTemplate.queryForList(sql, Long.class, parentId);
    }

    private String buildWhereClause(CosmeticFilterRequest filter, List<Object> params, User user) {
        StringBuilder whereSql = new StringBuilder(" WHERE 1=1 ");

        if (filter.getCatalogId() != null) {
            List<Long> catalogIds = getAllChildIdsRecursively(filter.getCatalogId());
            catalogIds.add(filter.getCatalogId());
            whereSql.append(" AND c.catalog_id IN (")
                    .append(String.join(",", Collections.nCopies(catalogIds.size(), "?")))
                    .append(")");
            params.addAll(catalogIds);
        }

        if (filter.getBrandIds() != null && !filter.getBrandIds().isEmpty()) {
            whereSql.append(" AND c.brand_id IN (")
                    .append(String.join(",", Collections.nCopies(filter.getBrandIds().size(), "?")))
                    .append(")");
            params.addAll(filter.getBrandIds());
        }

        if (filter.getActionIds() != null && !filter.getActionIds().isEmpty()) {
            whereSql.append(" AND c.id IN (SELECT cosmetic_id FROM cosmetic_cosmetic_action WHERE action_id IN (")
                    .append(String.join(",", Collections.nCopies(filter.getActionIds().size(), "?")))
                    .append("))");
            params.addAll(filter.getActionIds());
        }

        if (filter.getSkinTypeIds() != null && !filter.getSkinTypeIds().isEmpty()) {
            whereSql.append(" AND c.id IN (SELECT cosmetic_id FROM cosmetic_skin_type WHERE skin_type_id IN (")
                    .append(String.join(",", Collections.nCopies(filter.getSkinTypeIds().size(), "?")))
                    .append("))");
            params.addAll(filter.getSkinTypeIds());
        }

        if (filter.getName() != null && !filter.getName().trim().isEmpty()) {
            whereSql.append(" AND c.name ILIKE ?");
            params.add("%" + filter.getName().trim() + "%"); // Поиск по части имени, без учета регистра
            if (user != null) {
                String searchQuery = filter.getName();

                // Проверяем, есть ли уже такая запись у пользователя
                boolean exists = userSearchHistoryService.existsByUserAndSearchQuery(user, searchQuery);

                if (!exists) {
                    UserSearchHistory userSearchHistory = new UserSearchHistory();
                    userSearchHistory.setSearchQuery(filter.getName());
                    userSearchHistory.setUser(user);
                    userSearchHistory.setDeleted(false);
                    userSearchHistoryService.save(userSearchHistory);
                }
            }
        }

        return whereSql.toString();
    }

    // Группируем результаты по косметике
    private List<CosmeticResponse> groupCosmeticResponses(List<Map<String, Object>> rows, String lang, boolean isAllData) {
        List<CosmeticResponse> result = new ArrayList<>();
        for (Map<String, Object> row : rows) {
            result.add(mapRowToCosmeticResponse(row, lang, isAllData));
        }
        return result;
    }

    private CosmeticResponse mapRowToCosmeticResponse(Map<String, Object> row, String lang, boolean isAllData) {
        CosmeticResponse response = new CosmeticResponse();
        response.setId(safeGetLong(row, "cosmetic_id"));
        response.setName(safeGetString(row, "cosmetic_name"));
        response.setRating(safeGetLong(row, "rating"));
        if (row.get("favorite_count") != null){
            response.setFavoriteCount(safeGetLong(row, "favorite_count"));
        }
        if (isAllData) {
            response.setCompatibility(safeGetString(row, "compatibility"));
            response.setCompatibilityEN(safeGetString(row, "compatibility_en"));
            response.setCompatibilityKR(safeGetString(row, "compatibility_kr"));

            response.setUsageRecommendations(safeGetString(row, "usage_recommendations"));
            response.setUsageRecommendationsEN(safeGetString(row, "usage_recommendations_en"));
            response.setUsageRecommendationsKR(safeGetString(row, "usage_recommendations_kr"));

            response.setApplicationMethod(safeGetString(row, "application_method"));
            response.setApplicationMethodEN(safeGetString(row, "application_method_en"));
            response.setApplicationMethodKR(safeGetString(row, "application_method_kr"));
        } else  {
            if ("en".equals(lang)) {
                response.setCompatibility(safeGetString(row, "compatibility_en"));
                response.setUsageRecommendations(safeGetString(row, "usage_recommendations_en"));
                response.setApplicationMethod(safeGetString(row, "application_method_en"));
            } else if ("ko".equals(lang)) {
                response.setCompatibility(safeGetString(row, "compatibility_kr"));
                response.setUsageRecommendations(safeGetString(row, "usage_recommendations_kr"));
                response.setApplicationMethod(safeGetString(row, "application_method_kr"));
            } else if ("ru".equals(lang)) {
                response.setCompatibility(safeGetString(row, "compatibility"));
                response.setUsageRecommendations(safeGetString(row, "usage_recommendations"));
                response.setApplicationMethod(safeGetString(row, "application_method"));
            }
        }

        // Brand
        BrandResponse brand = new BrandResponse();
        brand.setId(safeGetLong(row, "brand_id"));
        brand.setName(safeGetString(row, "brand_name"));
        response.setBrand(brand);

        // Catalog
        CatalogResponse catalog = new CatalogResponse();
        catalog.setId(safeGetLong(row, "catalog_id"));
        if ("en".equals(lang)) {
            catalog.setName(safeGetString(row, "catalog_name_en"));
        } else if ("ko".equals(lang)) {
            catalog.setName(safeGetString(row, "catalog_name_ko"));
        } else {
            catalog.setName(safeGetString(row, "catalog_name")); // "ru" или дефолт
        }
        catalog.setHasChildren((Boolean) row.get("has_children"));
        response.setCatalog(catalog);

        // Actions
        List<Long> actionIds = safeGetLongList(row, "action_ids");
        List<String> actionNames;
        if ("en".equals(lang)) {
            actionNames = safeGetStringList(row, "action_names_en");
        } else if ("ko".equals(lang)) {
            actionNames = safeGetStringList(row, "action_names_ko");
        } else {
            actionNames = safeGetStringList(row, "action_names");
        }

        List<ActionResponse> actions = new ArrayList<>();
        for (int i = 0; i < Math.min(actionIds.size(), actionNames.size()); i++) {
            if (actionIds.get(i) != null && actionNames.get(i) != null) {
                actions.add(new ActionResponse(actionIds.get(i), actionNames.get(i)));
            }
        }
        response.setActions(actions);

        // Skin Types
        List<Long> skinTypeIds = safeGetLongList(row, "skin_type_ids");
        List<String> skinTypeNames;
        if ("en".equals(lang)) {
            skinTypeNames = safeGetStringList(row, "skin_type_names_en");
        } else if ("ko".equals(lang)) {
            skinTypeNames = safeGetStringList(row, "skin_type_names_ko");
        } else {
            skinTypeNames = safeGetStringList(row, "skin_type_names");
        }
        List<SkinTypeResponse> skinTypes = new ArrayList<>();
        for (int i = 0; i < Math.min(skinTypeIds.size(), skinTypeNames.size()); i++) {
            if (skinTypeIds.get(i) != null && skinTypeNames.get(i) != null) {
                skinTypes.add(new SkinTypeResponse(skinTypeIds.get(i), skinTypeNames.get(i)));
            }
        }
        response.setSkinTypes(skinTypes);

        List<Long> ingredientIds = safeGetLongList(row, "ingredient_ids");
        List<String> ingredientNames = safeGetStringList(row, "ingredient_names");
        List<IngredientResponse> ingredients = new ArrayList<>();
        for (int i = 0; i < Math.min(ingredientIds.size(), ingredientNames.size()); i++) {
            if (ingredientIds.get(i) != null && ingredientNames.get(i) != null) {
                ingredients.add(new IngredientResponse(ingredientIds.get(i), ingredientNames.get(i)));
            }
        }
        response.setIngredients(ingredients);
        // Images
        List<UUID> imageIds = safeGetUUIDList(row, "image_ids");
        List<String> imageUrls = safeGetStringList(row, "image_urls");
        List<Boolean> imageIsMains = safeGetBooleanList(row, "image_is_main");
        List<ImageResponse> images = new ArrayList<>();
        for (int i = 0; i < Math.min(imageUrls.size(), imageIsMains.size()); i++) {
            if (imageIds.get(i) != null && imageUrls.get(i) != null && imageIsMains.get(i) != null) {
                images.add(new ImageResponse(imageIds.get(i), String.format(IMAGE_URL,response.getId(),  imageUrls.get(i)), imageIsMains.get(i)));
            }
        }
        response.setImages(images);

        List<Long> marketplaceIds = safeGetLongList(row, "marketplace_ids");
        List<String> marketplaceNames = safeGetStringList(row, "marketplace_names");
        List<String> marketplaceLocations = safeGetStringList(row, "marketplace_locations");
        List<String> marketplaceProductUrls = safeGetStringList(row, "marketplace_product_links");
        List<MarketplaceLinkResponse> marketplaces = new ArrayList<>();
        for (int i = 0; i < Math.min(marketplaceIds.size(), marketplaceNames.size()); i++) {
            if (marketplaceIds.get(i) != null && marketplaceNames.get(i) != null && marketplaceLocations.get(i) != null && marketplaceProductUrls.get(i) != null) {
                marketplaces.add(MarketplaceLinkResponse.builder()
                        .id(marketplaceIds.get(i))
                        .name(marketplaceNames.get(i))
                        .url(marketplaceProductUrls.get(i))
                        .locale(marketplaceLocations.get(i))
                        .build()

                );
            }
        }

        response.setMarketplaceLinks(marketplaces);
        return response;
    }

    private static Long safeGetLong(Map<String, Object> row, String key) {
        Object value = row.get(key);
        if (value == null) return null;
        if (value instanceof Number number) {
            return number.longValue();
        }
        try {
            return Long.valueOf(value.toString());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private static String safeGetString(Map<String, Object> row, String key) {
        Object value = row.get(key);
        return value != null ? value.toString() : null;
    }

    @SuppressWarnings("unchecked")
    private static List<Long> safeGetLongList(Map<String, Object> row, String key) {
        Object val = row.get(key);

        if (val == null) {
            return new ArrayList<>();
        }

        if (val instanceof PgArray pgArray) {
            try {
                Object[] array = (Object[]) pgArray.getArray();
                List<Long> result = new ArrayList<>(array.length);
                for (Object obj : array) {
                    if (obj != null) {
                        if (obj instanceof Number number) {
                            result.add(number.longValue());
                        } else if (obj instanceof String str && !str.isEmpty()) {
                            result.add(Long.parseLong(str));
                        }
                    }
                }
                return result;
            } catch (SQLException e) {
                throw new RuntimeException("Ошибка при чтении PgArray для ключа: " + key, e);
            }
        }
        return new ArrayList<>();
    }

    @SuppressWarnings("unchecked")
    private static List<String> safeGetStringList(Map<String, Object> row, String key) {
        Object val = row.get(key);
        if (val == null) return new ArrayList<>();
        if (val instanceof PgArray pgArray) {
            try {
                Object[] array = (Object[]) pgArray.getArray();
                List<String> result = new ArrayList<>(array.length);
                for (Object obj : array) {
                    if (obj != null) {
                        if (obj instanceof String str && !str.isEmpty()) {
                            result.add(str);
                        }
                    }
                }
                return result;
            } catch (SQLException e) {
                throw new RuntimeException("Ошибка при чтении PgArray для ключа: " + key, e);
            }
        }
        return new ArrayList<>();
    }

    private static List<UUID> safeGetUUIDList(Map<String, Object> row, String key) {
        Object val = row.get(key);
        if (val == null) return new ArrayList<>();
        if (val instanceof PgArray pgArray) {
            try {
                Object[] array = (Object[]) pgArray.getArray();
                List<UUID> result = new ArrayList<>(array.length);
                for (Object obj : array) {
                    if (obj != null) {
                        if (obj instanceof UUID str) {
                            result.add(str);
                        }
                    }
                }
                return result;
            } catch (SQLException e) {
                throw new RuntimeException("Ошибка при чтении PgArray для ключа: " + key, e);
            }
        }
        return new ArrayList<>();
    }

    private static List<Boolean> safeGetBooleanList(Map<String, Object> row, String key) {
        Object val = row.get(key);
        if (val == null) return new ArrayList<>();
        if (val instanceof PgArray pgArray) {
            try {
                Object[] array = (Object[]) pgArray.getArray();
                List<Boolean> result = new ArrayList<>(array.length);
                for (Object obj : array) {
                    if (obj != null) {
                        if (obj instanceof Boolean str) {
                            result.add(str);
                        }
                    }
                }
                return result;
            } catch (SQLException e) {
                throw new RuntimeException("Ошибка при чтении PgArray для ключа: " + key, e);
            }
        }
        return new ArrayList<>();
    }

    @Transactional
    public boolean remove(Long id) {
        if (!cosmeticRepo.existsById(id)) {
            return false;
        }
        cosmeticImageRepo.deleteByCosmeticId(id);
        favoriteCosmeticRepo.deleteByCosmeticId(id);
        cosmeticMarketplaceLinkRepo.deleteAllByCosmeticId(id);
        cosmeticRepo.deleteById(id);

        return true;
    }
}
