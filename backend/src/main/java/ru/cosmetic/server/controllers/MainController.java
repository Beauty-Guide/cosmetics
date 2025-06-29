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
import ru.cosmetic.server.models.CosmeticAction;
import ru.cosmetic.server.models.SkinType;
import ru.cosmetic.server.service.CosmeticService;
import ru.cosmetic.server.service.SkinTypeService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Пользовательские", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/api")
public class MainController {

    private final SkinTypeService skinTypeService;
    private final CosmeticService cosmeticService;

    @GetMapping("/find-all-by-skin-type")
    @Operation(summary = "Получение косметики по типу кожи")
    public ResponseEntity<?> getCosmeticsBySkinType(@RequestBody List<SkinType> skinType) {
        try {
            return ResponseEntity.ok(cosmeticService.getCosmeticsBySkinTypes(skinType));
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/find-all-by-action")
    @Operation(summary = "Получение косметики по типу кожи")
    public ResponseEntity<?> getCosmeticsByAction(@RequestBody List<CosmeticAction> cosmeticAction) {
        try {
            return ResponseEntity.ok(cosmeticService.getCosmeticsByActions(cosmeticAction));
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }


}