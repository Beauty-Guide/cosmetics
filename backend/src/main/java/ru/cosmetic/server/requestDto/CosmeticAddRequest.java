package ru.cosmetic.server.requestDto;

import lombok.Data;

import java.util.List;

@Data
public class CosmeticAddRequest {
    private String name;
    private String description;
    private Long brandId;
    private Long catalogId;
    private List<Long> keyIngredientIds;
    private List<Long> actionIds;
    private List<Long> skinTypeIds;
    private String compatibility;
    private String usageRecommendations;
    private String applicationMethod;
}
