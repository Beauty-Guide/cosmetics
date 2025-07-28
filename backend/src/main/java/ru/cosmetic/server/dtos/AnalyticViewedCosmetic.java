package ru.cosmetic.server.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AnalyticViewedCosmetic {

    private Long cosmeticId;
    private String name;
    private int viewCount;
    private LocalDate date;

    public AnalyticViewedCosmetic(Long cosmeticId, String name, int viewCount) {
        this.cosmeticId = cosmeticId;
        this.name = name;
        this.viewCount = viewCount;
    }

    public AnalyticViewedCosmetic(Long cosmeticId, String name, int viewCount, LocalDate date) {
        this.cosmeticId = cosmeticId;
        this.name = name;
        this.viewCount = viewCount;
        this.date = date;
    }
}
