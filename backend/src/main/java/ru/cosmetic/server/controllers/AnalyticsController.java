package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.dtos.AnalyticFavoriteCosmeticCount;
import ru.cosmetic.server.dtos.AnalyticProductViewCount;
import ru.cosmetic.server.dtos.AnalyticSearchFilter;
import ru.cosmetic.server.dtos.AnalyticViewedCosmetic;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.requestDto.CosmeticIdsRequest;
import ru.cosmetic.server.service.AnalyticsService;
import ru.cosmetic.server.service.FavoriteService;
import ru.cosmetic.server.service.UserService;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final FavoriteService favoriteService;
    private final UserService userService;

    @PostMapping("/event")
    @Operation(summary = "Сохранить аналитическое событие (авторизованный или гость)")
    public void track(@RequestBody AnalyticsRequest request, Principal principal) {
        User user = null;
        if (principal != null) {
            user  = userService.findByEmail(principal.getName());
        }
        String location = user != null ? user.getLocation() : null;
        request.setLocation(location);
        analyticsService.save(request, user);
    }

    @GetMapping("/statsSearchFilter")
    public AnalyticSearchFilter stats(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String lang) {
        return analyticsService.getStatsSearchFilter(startDate, endDate, lang);
    }

    @GetMapping("/brand-search-stats")
    public ResponseEntity<?> getSearchCombinations(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String lang) {
        return ResponseEntity.ok(analyticsService.getBrandSearchAnalytics(startDate, endDate, lang));
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