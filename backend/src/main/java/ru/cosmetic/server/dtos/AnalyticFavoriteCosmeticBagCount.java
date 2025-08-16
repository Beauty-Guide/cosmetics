package ru.cosmetic.server.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AnalyticFavoriteCosmeticBagCount {
    private String name;
    private String author;
    private int favoriteCount;
}
