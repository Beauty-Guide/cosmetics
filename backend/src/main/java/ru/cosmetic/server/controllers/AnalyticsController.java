package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.service.AnalyticsService;

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
}