package ru.cosmetic.server.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class CosmeticResponse {
    private Long id;
    private String name;
    private String description;
    private String compatibility;
    private String usageRecommendations;
    private String applicationMethod;
    private BrandResponse brand;
    private CatalogResponse catalog;
    private List<ActionResponse> actions;
    private List<SkinTypeResponse> skinTypes;
    private List<IngredientResponse> ingredients;
    private List<String> imageUrls;
}
