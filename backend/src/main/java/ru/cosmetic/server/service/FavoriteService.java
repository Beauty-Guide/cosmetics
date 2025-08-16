package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.dtos.AnalyticFavoriteCosmeticCount;
import ru.cosmetic.server.models.*;
import ru.cosmetic.server.repo.FavoriteCosmeticRepo;
import ru.cosmetic.server.repo.UserRepository;
import ru.cosmetic.server.responseDto.*;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteCosmeticRepo favoriteRepo;
    private final UserRepository userRepo;
    private final CosmeticService cosmeticService;
    private final CosmeticImageService cosmeticImageService;
    private final JdbcTemplate jdbcTemplate;
    private final String IMAGE_URL = "/api/getFile?cosmeticId=%s&fileName=%s";

    public void addToFavorites(String email, Long cosmeticId) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Cosmetic cosmetic = cosmeticService.findById(cosmeticId);

        if (favoriteRepo.findByUserAndCosmetic(user, cosmetic) != null) {
            throw new RuntimeException("Этот товар уже в избранном");
        }

        FavoriteCosmetic favorite = new FavoriteCosmetic();
        favorite.setUser(user);
        favorite.setCosmetic(cosmetic);
        favoriteRepo.save(favorite);
    }

    public void removeFromFavorites(String email, Long cosmeticId) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Cosmetic cosmetic = cosmeticService.findById(cosmeticId);
        FavoriteCosmetic favorite = favoriteRepo.findByUserAndCosmetic(user, cosmetic);
        if (favorite != null) {
            favoriteRepo.delete(favorite);
        }
    }

    public List<CosmeticResponse> getFavoritesByUser(String email, String lang) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
        List<FavoriteCosmetic> favorites = favoriteRepo.findByUser(user);
        return favorites.stream()
                .map(fav -> mapToCosmeticResponse(fav.getCosmetic(), lang))
                .toList();
    }

    private CosmeticResponse mapToCosmeticResponse(Cosmetic cosmetic, String lang) {
        return CosmeticResponse.builder()
                .id(cosmetic.getId())
                .name(cosmetic.getName())
                .compatibility(cosmetic.getCompatibility())
                .usageRecommendations(cosmetic.getUsageRecommendations())
                .applicationMethod(cosmetic.getApplicationMethod())
                .brand(mapBrandToBrandResponse(cosmetic.getBrand()))
                .catalog(mapCatalogToCatalogResponse(cosmetic.getCatalog(), lang))
                .actions(mapActionsToActionResponses(cosmetic.getActions(), lang))
                .skinTypes(mapSkinTypesToSkinTypeResponses(cosmetic.getSkinTypes(), lang))
                .ingredients(mapIngredientsToIngredientResponses(cosmetic.getIngredients()))
                .images(getImageUrls(cosmetic)) // предположим, что это метод получения URL изображений
                .build();
    }

    private String getLocalizedString(String defaultName, String enName, String krName, String lang) {
        if ("en".equals(lang)) {
            return enName != null ? enName : defaultName;
        } else if ("ko".equals(lang)) {
            return krName != null ? krName : defaultName;
        }
        return defaultName;
    }

    private BrandResponse mapBrandToBrandResponse(Brand brand) {
        if (brand == null) return null;
        return new BrandResponse(brand.getId(), brand.getName());
    }

    private CatalogResponse mapCatalogToCatalogResponse(Catalog catalog, String lang) {
        if (catalog == null) return null;
        return new CatalogResponse(
                catalog.getId(),
                getLocalizedString(catalog.getName(), catalog.getNameEN(), catalog.getNameKR(), lang)
        );
    }

    private List<ActionResponse> mapActionsToActionResponses(List<CosmeticAction> actions, String lang) {
        return actions != null ? actions.stream()
                .map(a -> new ActionResponse(
                        a.getId(),
                        getLocalizedString(a.getName(), a.getNameEN(), a.getNameKR(), lang)
                ))
                .toList() : List.of();
    }

    private List<SkinTypeResponse> mapSkinTypesToSkinTypeResponses(List<SkinType> skinTypes, String lang) {
        return skinTypes != null ? skinTypes.stream()
                .map(s -> new SkinTypeResponse(
                        s.getId(),
                        getLocalizedString(s.getName(), s.getNameEN(), s.getNameKR(), lang)
                ))
                .toList() : List.of();
    }

    private List<IngredientResponse> mapIngredientsToIngredientResponses(List<Ingredient> ingredients) {
        return ingredients != null ? ingredients.stream()
                .map(i -> new IngredientResponse(i.getId(), i.getName()))
                .toList() : List.of();
    }

    private List<ImageResponse> getImageUrls(Cosmetic cosmetic) {
        // Реализуй свою логику получения URL изображений
        List<CosmeticImage> allByCosmetic = cosmeticImageService.findAllByCosmetic(cosmetic);
        Long cosmeticId = cosmetic.getId();
        List<ImageResponse> images = new ArrayList<>();
        for (CosmeticImage cosmeticImage : allByCosmetic) {
            ImageResponse imageResponse = new ImageResponse();
            imageResponse.setId(cosmeticImage.getId());
            imageResponse.setUrl(String.format(IMAGE_URL, cosmeticId, cosmeticImage.getUrl()));
            imageResponse.setIsMain(cosmeticImage.isMain());
            images.add(imageResponse);
        }
        return images;
    }

    public List<AnalyticFavoriteCosmeticCount> getTopFavoriteCosmetics() {
        String sql = """
        SELECT c.id, c.name, COUNT(fc.cosmetic_id) AS favorite_count
        FROM favorite_cosmetics fc
        JOIN cosmetic c ON fc.cosmetic_id = c.id
        GROUP BY c.id, c.name
        ORDER BY favorite_count DESC
        LIMIT 15
        """;

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource params = new MapSqlParameterSource();

        return namedParameterJdbcTemplate.query(
                sql,
                params,
                (rs, rowNum) -> new AnalyticFavoriteCosmeticCount(
                        rs.getString("name"),
                        rs.getInt("favorite_count")
                )
        );
    }
}