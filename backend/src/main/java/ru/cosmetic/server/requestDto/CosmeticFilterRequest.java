package ru.cosmetic.server.requestDto;

import lombok.Data;

import java.util.List;
import java.util.function.LongBinaryOperator;

@Data
public class CosmeticFilterRequest {
    // Фильтры
    private Long catalogId;
    private List<Long> actionIds;
    private List<Long> skinTypeIds;
    private List<Long> brandIds;

    // Пагинация
    private Long page = 0L;
    private Long size = 10L;
    private Long total = 0L;

    // Сортировка
    private String sortBy;
    private String sortDirection;
}
