package ru.cosmetic.server.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class CosmeticResponse {
    private Long id;
    private String name;
    private String description;
    private String compatibility;
    private String compatibilityEN;
    private String compatibilityKR;
    private String usageRecommendations;
    private String usageRecommendationsEN;
    private String usageRecommendationsKR;
    private String applicationMethod;
    private String applicationMethodEN;
    private String applicationMethodKR;
    private BrandResponse brand;
    private CatalogResponse catalog;
    private List<ActionResponse> actions;
    private List<SkinTypeResponse> skinTypes;
    private List<IngredientResponse> ingredients;
    private List<ImageResponse> images;
    private Boolean has_children;
    private Long rating;
    private List<MarketplaceLinkResponse> marketplaceLinks;
    private Long favoriteCount;
}
