package ru.cosmetic.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.postgresql.jdbc.PgArray;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.repo.CosmeticImageRepo;
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

    public CosmeticResponse getCosmeticById(Long id) {
        StringBuilder sql = new StringBuilder("""
                    SELECT
                        c.id AS cosmetic_id,
                        c.name AS cosmetic_name,
                        c.description AS cosmetic_description,
                        c.compatibility,
                        c.usage_recommendations,
                        c.application_method,
                        b.id AS brand_id,
                        b.name AS brand_name,
                        cat.id AS catalog_id,
                        cat.name AS catalog_name,
                        ARRAY_AGG(DISTINCT a.id) AS action_ids,
                        ARRAY_AGG(DISTINCT a.name) AS action_names,
                        ARRAY_AGG(DISTINCT st.id) AS skin_type_ids,
                        ARRAY_AGG(DISTINCT st.name) AS skin_type_names,
                        ARRAY_AGG(DISTINCT i.id) AS ingredient_ids,
                        ARRAY_AGG(DISTINCT i.name) AS ingredient_names,
                        ARRAY_AGG(DISTINCT img.id) AS image_ids,
                        ARRAY_AGG(DISTINCT img.url) AS image_urls,
                        ARRAY_AGG(CASE WHEN img.is_main THEN 1 ELSE 0 END) AS image_is_main
                    FROM cosmetic c
                    JOIN brand b ON c.brand_id = b.id
                    JOIN catalog cat ON c.catalog_id = cat.id
                    LEFT JOIN cosmetic_cosmetic_action cca ON c.id = cca.cosmetic_id
                    LEFT JOIN cosmetic_action a ON cca.action_id = a.id
                    LEFT JOIN cosmetic_skin_type cst ON c.id = cst.cosmetic_id
                    LEFT JOIN skin_type st ON cst.skin_type_id = st.id
                    LEFT JOIN cosmetic_ingredient ci ON c.id = ci.cosmetic_id
                    LEFT JOIN ingredient i ON ci.ingredient_id = i.id
                    LEFT JOIN cosmetic_image img ON c.id = img.cosmetic_id
                    WHERE c.id = ?
                    GROUP BY c.id, b.id, cat.id
                """);

        try {
            Map<String, Object> row = jdbcTemplate.queryForMap(sql.toString(), id);
            return mapRowToCosmeticResponse(row);
        } catch (EmptyResultDataAccessException ex) {
            return null; // или throw new ResourceNotFoundException("Cosmetic not found");
        }
    }

    public CosmeticsResponse getCosmeticsByFilters(CosmeticFilterRequest filter) {
        List<Object> params = new ArrayList<>();
        StringBuilder sql = new StringBuilder("""
            SELECT
                c.id AS cosmetic_id,
                c.name AS cosmetic_name,
                c.description AS cosmetic_description,
                c.compatibility,
                c.usage_recommendations,
                c.application_method,
                b.id AS brand_id,
                b.name AS brand_name,
                cat.id AS catalog_id,
                cat.name AS catalog_name,
                ARRAY_AGG(DISTINCT a.id) AS action_ids,
                ARRAY_AGG(DISTINCT a.name) AS action_names,
                ARRAY_AGG(DISTINCT st.id) AS skin_type_ids,
                ARRAY_AGG(DISTINCT st.name) AS skin_type_names,
                ARRAY_AGG(DISTINCT i.id) AS ingredient_ids,
                ARRAY_AGG(DISTINCT i.name) AS ingredient_names,
                ARRAY_AGG(DISTINCT img.id) AS image_ids,
                ARRAY_AGG(DISTINCT img.url) AS image_urls,
                ARRAY_AGG(CASE WHEN img.is_main THEN 1 ELSE 0 END) AS image_is_main
            FROM cosmetic c
            JOIN brand b ON c.brand_id = b.id
            JOIN catalog cat ON c.catalog_id = cat.id
            LEFT JOIN cosmetic_cosmetic_action cca ON c.id = cca.cosmetic_id
            LEFT JOIN cosmetic_action a ON cca.action_id = a.id
            LEFT JOIN cosmetic_skin_type cst ON c.id = cst.cosmetic_id
            LEFT JOIN skin_type st ON cst.skin_type_id = st.id
            LEFT JOIN cosmetic_ingredient ci ON c.id = ci.cosmetic_id
            LEFT JOIN ingredient i ON ci.ingredient_id = i.id
            LEFT JOIN cosmetic_image img ON c.id = img.cosmetic_id
        """);

        // Добавляем WHERE часть
        sql.append(buildWhereClause(filter, params));

        // GROUP BY
        sql.append(" GROUP BY c.id, b.id, cat.id");

        // Сортировка
        if ("name".equalsIgnoreCase(filter.getSortBy())) {
            sql.append(" ORDER BY c.name ").append(filter.getSortDirection().toUpperCase());
        } else {
            sql.append(" ORDER BY c.id ").append(filter.getSortDirection().toUpperCase());
        }

        // Пагинация
        sql.append(" LIMIT ? OFFSET ?");
        params.add(filter.getSize());
        params.add(filter.getPage() * filter.getSize());

        // Выполняем запрос
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql.toString(), params.toArray());

        List<CosmeticResponse> cosmeticResponses = groupCosmeticResponses(rows);
        CosmeticsResponse cosmeticsResponse = new CosmeticsResponse();
        cosmeticsResponse.setCosmetics(cosmeticResponses);
        cosmeticsResponse.setTotal(getCountOfCosmetics(filter)); // теперь передаем filter

        return cosmeticsResponse;
    }

    private int getCountOfCosmetics(CosmeticFilterRequest filter) {
        List<Object> countParams = new ArrayList<>();
        String whereClause = buildWhereClause(filter, countParams);

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

    private String buildWhereClause(CosmeticFilterRequest filter, List<Object> params) {
        StringBuilder whereSql = new StringBuilder(" WHERE 1=1 ");

        if (filter.getCatalogId() != null) {
            whereSql.append(" AND c.catalog_id = ?");
            params.add(filter.getCatalogId());
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
        }

        return whereSql.toString();
    }

    // Группируем результаты по косметике
    private List<CosmeticResponse> groupCosmeticResponses(List<Map<String, Object>> rows) {
        List<CosmeticResponse> result = new ArrayList<>();
        for (Map<String, Object> row : rows) {
            result.add(mapRowToCosmeticResponse(row));
        }
        return result;
    }

    private CosmeticResponse mapRowToCosmeticResponse(Map<String, Object> row) {
        CosmeticResponse response = new CosmeticResponse();
        response.setId(safeGetLong(row, "cosmetic_id"));
        response.setName(safeGetString(row, "cosmetic_name"));
        response.setDescription(safeGetString(row, "cosmetic_description"));
        response.setCompatibility(safeGetString(row, "compatibility"));
        response.setUsageRecommendations(safeGetString(row, "usage_recommendations"));
        response.setApplicationMethod(safeGetString(row, "application_method"));

        // Brand
        BrandResponse brand = new BrandResponse();
        brand.setId(safeGetLong(row, "brand_id"));
        brand.setName(safeGetString(row, "brand_name"));
        response.setBrand(brand);

        // Catalog
        CatalogResponse catalog = new CatalogResponse();
        catalog.setId(safeGetLong(row, "catalog_id"));
        catalog.setName(safeGetString(row, "catalog_name"));
        response.setCatalog(catalog);

        // Actions
        List<Long> actionIds = safeGetLongList(row, "action_ids");
        List<String> actionNames = safeGetStringList(row, "action_names");
        List<ActionResponse> actions = new ArrayList<>();
        for (int i = 0; i < Math.min(actionIds.size(), actionNames.size()); i++) {
            if (actionIds.get(i) != null && actionNames.get(i) != null) {
                actions.add(new ActionResponse(actionIds.get(i), actionNames.get(i)));
            }
        }
        response.setActions(actions);

        // Skin Types
        List<Long> skinTypeIds = safeGetLongList(row, "skin_type_ids");
        List<String> skinTypeNames = safeGetStringList(row, "skin_type_names");
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
        for (int i = 0; i < Math.min(imageIds.size(), imageIsMains.size()); i++) {
            if (imageIds.get(i) != null && imageUrls.get(i) != null && imageIsMains.get(i) != null) {
                images.add(new ImageResponse(imageIds.get(i), String.format(IMAGE_URL,response.getId(),  imageUrls.get(i)), imageIsMains.get(i)));
            }
        }
        response.setImages(images);
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
                        if (obj instanceof Integer str) {
                            if (obj.equals(1)){
                                result.add(true);
                            }else {
                                result.add(false);
                            }

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
        cosmeticRepo.deleteById(id);

        return true;
    }
}
