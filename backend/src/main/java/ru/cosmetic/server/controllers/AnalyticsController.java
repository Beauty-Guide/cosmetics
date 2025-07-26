package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.dtos.AnalyticSearchFilter;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.service.AnalyticsService;

import java.time.LocalDate;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @PostMapping("/event")
    @Operation(summary = "Сохранить аналитическое событие (авторизованный или гость)")
    public void track(@RequestBody AnalyticsRequest request,
                      @RequestHeader(name = "Authorization", required = false) String authHeader) {
        analyticsService.save(request, authHeader);
    }

    @GetMapping("/statsSearchFilter")
    public AnalyticSearchFilter stats(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return analyticsService.getStatsSearchFilter(startDate, endDate);
    }

    @GetMapping("/brand-search-stats")
    public ResponseEntity<?> getSearchCombinations(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return ResponseEntity.ok(analyticsService.getBrandSearchAnalytics(startDate, endDate));
    }

}