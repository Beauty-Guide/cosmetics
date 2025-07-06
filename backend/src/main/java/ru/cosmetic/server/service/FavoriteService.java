package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.*;
import ru.cosmetic.server.repo.FavoriteCosmeticRepo;
import ru.cosmetic.server.repo.UserRepository;
import ru.cosmetic.server.responseDto.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteCosmeticRepo favoriteRepo;
    private final UserRepository userRepo;
    private final CosmeticService cosmeticService;
    private final CosmeticImageService cosmeticImageService;
    private String IMAGE_URL= "/api/files?cosmeticId=%sfileName=%s";

    public void addToFavorites(String username, Long cosmeticId) {
        User user = userRepo.findByUsername(username).orElseThrow();
        Cosmetic cosmetic = cosmeticService.findById(cosmeticId);

        if (favoriteRepo.findByUserAndCosmetic(user, cosmetic) != null) {
            throw new RuntimeException("Этот товар уже в избранном");
        }

        FavoriteCosmetic favorite = new FavoriteCosmetic();
        favorite.setUser(user);
        favorite.setCosmetic(cosmetic);
        favoriteRepo.save(favorite);
    }

    public void removeFromFavorites(String username, Long cosmeticId) {
        User user = userRepo.findByUsername(username).orElseThrow();
        Cosmetic cosmetic = cosmeticService.findById(cosmeticId);
        FavoriteCosmetic favorite = favoriteRepo.findByUserAndCosmetic(user, cosmetic);
        if (favorite != null) {
            favoriteRepo.delete(favorite);
        }
    }

    public List<CosmeticResponse> getFavoritesByUser(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        List<FavoriteCosmetic> favorites = favoriteRepo.findByUser(user);

        return favorites.stream()
                .map(fav -> mapToCosmeticResponse(fav.getCosmetic()))
                .toList();
    }

    private CosmeticResponse mapToCosmeticResponse(Cosmetic cosmetic) {
        return CosmeticResponse.builder()
                .id(cosmetic.getId())
                .name(cosmetic.getName())
                .description(cosmetic.getDescription())
                .compatibility(cosmetic.getCompatibility())
                .usageRecommendations(cosmetic.getUsageRecommendations())
                .applicationMethod(cosmetic.getApplicationMethod())
                .brand(mapBrandToBrandResponse(cosmetic.getBrand()))
                .catalog(mapCatalogToCatalogResponse(cosmetic.getCatalog()))
                .actions(mapActionsToActionResponses(cosmetic.getActions()))
                .skinTypes(mapSkinTypesToSkinTypeResponses(cosmetic.getSkinTypes()))
                .ingredients(mapIngredientsToIngredientResponses(cosmetic.getIngredients()))
                .imageUrls(getImageUrls(cosmetic)) // предположим, что это метод получения URL изображений
                .build();
    }

// Примеры простых мапперов (можно вынести в отдельный Mapper класс)

    private BrandResponse mapBrandToBrandResponse(Brand brand) {
        if (brand == null) return null;
        return new BrandResponse(brand.getId(), brand.getName());
    }

    private CatalogResponse mapCatalogToCatalogResponse(Catalog catalog) {
        if (catalog == null) return null;
        return new CatalogResponse(catalog.getId(), catalog.getName());
    }

    private List<ActionResponse> mapActionsToActionResponses(List<CosmeticAction> actions) {
        return actions != null ? actions.stream()
                .map(a -> new ActionResponse(a.getId(), a.getName()))
                .toList() : List.of();
    }

    private List<SkinTypeResponse> mapSkinTypesToSkinTypeResponses(List<SkinType> skinTypes) {
        return skinTypes != null ? skinTypes.stream()
                .map(s -> new SkinTypeResponse(s.getId(), s.getName()))
                .toList() : List.of();
    }

    private List<IngredientResponse> mapIngredientsToIngredientResponses(List<Ingredient> ingredients) {
        return ingredients != null ? ingredients.stream()
                .map(i -> new IngredientResponse(i.getId(), i.getName()))
                .toList() : List.of();
    }

    private List<String> getImageUrls(Cosmetic cosmetic) {
        // Реализуй свою логику получения URL изображений
        List<CosmeticImage> allByCosmetic = cosmeticImageService.findAllByCosmetic(cosmetic);
        Long cosmeticId = cosmetic.getId();
        return allByCosmetic.stream().map(cosmeticImage -> String.format(IMAGE_URL, cosmeticId, cosmeticImage.getUrl())).collect(Collectors.toList()); // Заглушка
    }
}