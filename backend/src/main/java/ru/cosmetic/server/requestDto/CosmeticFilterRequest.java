package ru.cosmetic.server.requestDto;

import lombok.Data;

import java.util.List;

@Data
public class CosmeticFilterRequest {
    // Фильтры
    private Long catalogId;
    private List<Long> actionIds;
    private List<Long> skinTypeIds;
    private List<Long> brandIds;
    private String name;

    // Пагинация
    private Long page = 0L;
    private Long size = 10L;

    // Сортировка
    private String sortBy;
    private String sortDirection;
    private boolean byPopularity;
    private boolean byDate;
    private boolean byFavourite;
}
