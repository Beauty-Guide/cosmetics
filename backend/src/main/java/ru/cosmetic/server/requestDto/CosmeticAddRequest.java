package ru.cosmetic.server.requestDto;

import lombok.Data;

import java.util.List;

@Data
public class CosmeticAddRequest {
    private String name;
    private Long brandId;
    private Long catalogId;
    private List<Long> keyIngredientIds;
    private List<Long> actionIds;
    private List<Long> skinTypeIds;
    private String compatibility;
    private String compatibilityEN;
    private String compatibilityKR;
    private String usageRecommendations;
    private String usageRecommendationsEN;
    private String usageRecommendationsKR;
    private String applicationMethod;
    private String applicationMethodEN;
    private String applicationMethodKR;
    private List<String> imagesForDeletion;
    private Integer rating;
    private List<MarketplaceLinkRequest> marketplaceLinks;
}
