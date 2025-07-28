package ru.cosmetic.server.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AnalyticSearchFilterCountItem {
    private String label;
    private Long count;
}