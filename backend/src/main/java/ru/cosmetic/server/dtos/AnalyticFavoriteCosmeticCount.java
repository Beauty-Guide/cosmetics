package ru.cosmetic.server.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AnalyticFavoriteCosmeticCount {
    private Long id;
    private String name;
    private int favoriteCount;
}
