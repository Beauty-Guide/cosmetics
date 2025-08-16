package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.dtos.*;
import ru.cosmetic.server.models.Location;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.requestDto.CosmeticIdsRequest;
import ru.cosmetic.server.service.AnalyticsService;
import ru.cosmetic.server.service.FavoriteService;
import ru.cosmetic.server.service.LocationService;
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
    private final LocationService locationService;

    @PostMapping("/event")
    @Operation(summary = "Сохранить аналитическое событие (авторизованный или гость)")
    public void track(@RequestBody AnalyticsRequest request, Principal principal) {
        User user = null;
        if (principal != null) {
            user = userService.findByEmail(principal.getName());
        }
        Location location = user != null ? user.getLocation() : null;
        if (location != null) {
            request.setLocation(location);
        }
        analyticsService.save(request, user);
    }

    @GetMapping("/statsSearchFilter")
    public AnalyticSearchFilter stats(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) String lang, @RequestParam(required = false) String countryId) {
        return analyticsService.getStatsSearchFilter(startDate, endDate, lang, countryId);
    }

    @GetMapping("/brand-search-stats")
    public ResponseEntity<?> getSearchCombinations(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) String lang, @RequestParam(required = false) String countryId) {
        return ResponseEntity.ok(analyticsService.getBrandSearchAnalytics(startDate, endDate, lang, countryId));
    }

    @GetMapping("/topFavorite")
    public List<AnalyticFavoriteCosmeticCount> getTopFavoriteCosmetics(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) String countryId) {
        return analyticsService.getTopFavoriteCosmetics(startDate, endDate, countryId);
    }

    @GetMapping("/topFavoriteCosmeticBags")
    public List<AnalyticFavoriteCosmeticBagCount> getTopFavoriteCosmeticBags(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) String countryId) {
        return analyticsService.getTopFavoriteCosmeticCosmeticBags(startDate, endDate, countryId);
    }

    @GetMapping("/analyticViewsDayAllProducts")
    public List<AnalyticProductViewCount> getAnalyticViewsDayAllProducts(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) String countryId) {
        return analyticsService.getAnalyticViewsDayAllProducts(startDate, endDate, countryId);
    }

    @PostMapping("/getViews")
    public Map<Long, List<AnalyticViewedCosmetic>> getViewedProducts(@RequestBody(required = false) CosmeticIdsRequest cosmeticIdsRequest, @RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) String countryId) {
        List<Long> cosmeticIds = cosmeticIdsRequest != null ? cosmeticIdsRequest.getCosmeticIds() : null;
        return analyticsService.getViewedProducts(cosmeticIds, startDate, endDate, countryId);
    }

    @GetMapping("/getTopViewedCosmetics")
    public List<AnalyticViewedCosmetic> getTopViewedCosmetics(@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) String countryId) {
        return analyticsService.getTopViewedCosmetics(startDate, endDate, countryId);
    }

    @GetMapping("/clicks")
    public Map<Long, List<AnalyticClickCosmetic>> getClickCounts(@RequestBody(required = false) CosmeticIdsRequest cosmeticIdsRequest, @RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate, @RequestParam(required = false) String countryId) {
        List<Long> cosmeticIds = cosmeticIdsRequest != null ? cosmeticIdsRequest.getCosmeticIds() : null;
        return analyticsService.getClickCounts(cosmeticIds, startDate, endDate, countryId);
    }

    @GetMapping("/locations")
    public ResponseEntity<?> getLocations(@RequestParam(required = false) String lang) {
        return ResponseEntity.ok(locationService.getCountriesWithCities(lang));
    }

}