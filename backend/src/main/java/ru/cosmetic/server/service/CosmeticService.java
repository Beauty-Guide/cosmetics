package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.postgresql.jdbc.PgArray;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.repo.CosmeticRepo;
import ru.cosmetic.server.requestDto.CosmeticFilterRequest;
import ru.cosmetic.server.responseDto.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CosmeticService {


    private final CosmeticRepo cosmeticRepo;
    private final MinioService minioService;
    private final CosmeticImageService cosmeticImageService;
    private final JdbcTemplate jdbcTemplate;

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
                        ARRAY_AGG(DISTINCT img.url) AS image_urls
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

    public List<CosmeticResponse> getCosmeticsByFilters(CosmeticFilterRequest filter) {
        filter.setTotal(getCountOfCosmetics());
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
                        ARRAY_AGG(DISTINCT img.url) AS image_urls
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
                    WHERE 1=1
                """);

        List<Object> params = new ArrayList<>();

        if (filter.getCatalogId() != null) {
            sql.append(" AND c.catalog_id = ?");
            params.add(filter.getCatalogId());
        }

        if (filter.getBrandIds() != null && !filter.getBrandIds().isEmpty()) {
            sql.append(" AND c.brand_id IN (")
                    .append(String.join(",", Collections.nCopies(filter.getBrandIds().size(), "?")))
                    .append(")");
            params.addAll(filter.getBrandIds());
        }

        if (filter.getActionIds() != null && !filter.getActionIds().isEmpty()) {
            sql.append(" AND c.id IN (SELECT cosmetic_id FROM cosmetic_cosmetic_action WHERE action_id IN (")
                    .append(String.join(",", Collections.nCopies(filter.getActionIds().size(), "?")))
                    .append("))");
            params.addAll(filter.getActionIds());
        }

        if (filter.getSkinTypeIds() != null && !filter.getSkinTypeIds().isEmpty()) {
            sql.append(" AND c.id IN (SELECT cosmetic_id FROM cosmetic_skin_type WHERE skin_type_id IN (")
                    .append(String.join(",", Collections.nCopies(filter.getSkinTypeIds().size(), "?")))
                    .append("))");
            params.addAll(filter.getSkinTypeIds());
        }

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

        return groupCosmeticResponses(rows);
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
        List<String> imageUrls = safeGetStringList(row, "image_urls");
        response.setImageUrls(imageUrls);
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

}
