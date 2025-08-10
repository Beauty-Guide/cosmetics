package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.enums.ActionType;
import ru.cosmetic.server.exceptions.AppError;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.service.AnalyticsService;
import ru.cosmetic.server.service.FavoriteService;
import ru.cosmetic.server.service.UserService;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorites")
@Tag(name = "Избранные", description = "Доступен только авторизованным пользователям")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final AnalyticsService analyticsService;
    private final UserService userService;

    // --- Добавление в избранное ---
    @PostMapping("/{cosmeticId}/add")
    @Operation(summary = "Добавить косметику в избранное",
            description = "Добавляет товар в список избранных у текущего пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Косметика успешно добавлена"),
            @ApiResponse(responseCode = "401", description = "Пользователь не авторизован",
                    content = @Content(schema = @Schema(implementation = AppError.class))),
            @ApiResponse(responseCode = "409", description = "Косметика уже в избранном",
                    content = @Content(schema = @Schema(implementation = AppError.class))),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера",
                    content = @Content(schema = @Schema(implementation = AppError.class)))
    })
    public ResponseEntity<?> addToFavorites(
            @Parameter(description = "ID косметического средства", example = "1", required = true)
            @PathVariable Long cosmeticId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AppError(HttpStatus.UNAUTHORIZED.value(), "Пользователь не авторизован"));
        }

        try {
            String email = principal.getName();
            User user = userService.findByEmail(principal.getName());
            analyticsService.save(AnalyticsRequest.builder()
                    .cosmeticId(cosmeticId)
                    .action(ActionType.FAV)
                    .location(user.getLocation() != null ? user.getLocation() : null)
                    .build(), user);
            favoriteService.addToFavorites(email, cosmeticId);
            return ResponseEntity.ok("Косметика успешно добавлена в избранное");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AppError(HttpStatus.CONFLICT.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AppError(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Ошибка на сервере: " + e.getMessage()));
        }
    }

    // --- Удаление из избранного ---
    @DeleteMapping("/{cosmeticId}/remove")
    @Operation(summary = "Удалить косметику из избранного",
            description = "Удаляет товар из списка избранных у текущего пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Косметика успешно удалена"),
            @ApiResponse(responseCode = "401", description = "Пользователь не авторизован",
                    content = @Content(schema = @Schema(implementation = AppError.class))),
            @ApiResponse(responseCode = "404", description = "Косметика не найдена в избранном",
                    content = @Content(schema = @Schema(implementation = AppError.class))),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера",
                    content = @Content(schema = @Schema(implementation = AppError.class)))
    })
    public ResponseEntity<?> removeFromFavorites(
            @Parameter(description = "ID косметического средства", example = "1", required = true)
            @PathVariable Long cosmeticId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AppError(HttpStatus.UNAUTHORIZED.value(), "Пользователь не авторизован"));
        }

        try {
            String email = principal.getName();
            favoriteService.removeFromFavorites(email, cosmeticId);
            return ResponseEntity.ok("Косметика успешно удалена из избранного");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AppError(HttpStatus.NOT_FOUND.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AppError(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Ошибка на сервере: " + e.getMessage()));
        }
    }

    // --- Получение списка избранного ---
    @GetMapping
    @Operation(summary = "Получить список избранных товаров",
            description = "Возвращает список всех косметических средств, добавленных пользователем в избранное")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список успешно получен",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Пользователь не авторизован",
                    content = @Content(schema = @Schema(implementation = AppError.class))),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера",
                    content = @Content(schema = @Schema(implementation = AppError.class)))
    })
    public ResponseEntity<?> getFavorites(@RequestParam(required = false) String lang, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AppError(HttpStatus.UNAUTHORIZED.value(), "Пользователь не авторизован"));
        }

        try {
            String email = principal.getName();
            var favorites = favoriteService.getFavoritesByUser(email, lang);
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AppError(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Ошибка при получении избранного: " + e.getMessage()));
        }
    }
}