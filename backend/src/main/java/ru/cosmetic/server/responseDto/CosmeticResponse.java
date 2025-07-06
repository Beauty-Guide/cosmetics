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
    private String usageRecommendations;
    private String applicationMethod;
    private BrandResponse brand;
    private CatalogResponse catalog;
    private List<ActionResponse> actions;
    private List<SkinTypeResponse> skinTypes;
    private List<IngredientResponse> ingredients;
    private List<ImageResponse> images;
}
