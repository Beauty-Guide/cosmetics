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

    // Пагинация
    private int page = 0;
    private int size = 10;

    // Сортировка
    private String sortBy;
    private String sortDirection;
}
