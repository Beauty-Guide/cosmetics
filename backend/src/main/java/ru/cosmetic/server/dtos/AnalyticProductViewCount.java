package ru.cosmetic.server.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AnalyticProductViewCount {
    private LocalDate date;
    private int viewCount;

    public AnalyticProductViewCount(LocalDate date, int viewCount) {
        this.date = date;
        this.viewCount = viewCount;
    }

}
