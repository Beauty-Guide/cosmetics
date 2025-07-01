package ru.cosmetic.server.dtos;

import lombok.Data;

import java.util.List;

@Data
public class CosmeticDto {
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
