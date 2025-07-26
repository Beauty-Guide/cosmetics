package ru.cosmetic.server.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AnalyticSearchFilter {
    private List<AnalyticSearchFilterCountItem> brands;
    private List<AnalyticSearchFilterCountItem> skinTypes;
    private List<AnalyticSearchFilterCountItem> actions;
}