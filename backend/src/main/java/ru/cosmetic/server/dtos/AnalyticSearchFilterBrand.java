package ru.cosmetic.server.dtos;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AnalyticSearchFilterBrand {
    private String brand;
    private List<AnalyticSearchFilterCountItem> skinTypes = new ArrayList<>();
    private List<AnalyticSearchFilterCountItem> actions = new ArrayList<>();
    private List<AnalyticSearchFilterCountItem> queries = new ArrayList<>();
}