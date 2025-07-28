package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.dtos.AnalyticFavoriteCosmeticCount;
import ru.cosmetic.server.dtos.AnalyticProductViewCount;
import ru.cosmetic.server.dtos.AnalyticSearchFilter;
import ru.cosmetic.server.dtos.AnalyticViewedCosmetic;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.requestDto.CosmeticIdsRequest;
import ru.cosmetic.server.service.AnalyticsService;
import ru.cosmetic.server.service.FavoriteService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final FavoriteService favoriteService;

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

    @GetMapping("/topFavorite")
    public List<AnalyticFavoriteCosmeticCount> getTopFavoriteCosmetics() {
        return favoriteService.getTopFavoriteCosmetics();
    }

    @GetMapping("/analyticViewsDayAllProducts")
    public List<AnalyticProductViewCount> getAnalyticViewsDayAllProducts(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return analyticsService.getAnalyticViewsDayAllProducts(startDate, endDate);
    }

    @PostMapping("/getViews")
    public Map<Long, List<AnalyticViewedCosmetic>> getViewedProducts(
            @RequestBody(required = false) CosmeticIdsRequest cosmeticIdsRequest,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        List<Long> cosmeticIds = cosmeticIdsRequest != null ? cosmeticIdsRequest.getCosmeticIds() : null;
        return analyticsService.getViewedProducts(cosmeticIds, startDate, endDate);
    }

    @GetMapping("/getTopViewedCosmetics")
    public List<AnalyticViewedCosmetic> getTopViewedCosmetics(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return analyticsService.getTopViewedCosmetics( startDate, endDate);
    }

}