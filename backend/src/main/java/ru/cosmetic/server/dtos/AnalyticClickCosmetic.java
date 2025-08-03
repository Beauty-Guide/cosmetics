package ru.cosmetic.server.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AnalyticClickCosmetic {

    private Long cosmeticId;
    private String name;
    private int viewCount;
    private LocalDate date;

    public AnalyticClickCosmetic(Long cosmeticId, String name, int viewCount) {
        this.cosmeticId = cosmeticId;
        this.name = name;
        this.viewCount = viewCount;
    }

    public AnalyticClickCosmetic(Long cosmeticId, String name, int viewCount, LocalDate date) {
        this.cosmeticId = cosmeticId;
        this.name = name;
        this.viewCount = viewCount;
        this.date = date;
    }
}
