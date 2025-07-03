package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.cosmetic.server.requestDto.CosmeticFilterRequest;
import ru.cosmetic.server.service.CosmeticService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Пользовательские", description = "Доступны всем")
@RequestMapping("/api")
public class UserController {

    private final CosmeticService cosmeticService;

    @GetMapping("/getCosmeticsByFilters")
    @Operation(summary = "Получение косметики по фильтрам")
    public ResponseEntity<?> getCosmeticsByFilters(@RequestBody CosmeticFilterRequest request) {
        try {
            return ResponseEntity.ok(cosmeticService.getCosmeticsByFilters(request));
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

}