package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.cosmetic.server.dtos.CatalogDto;
import ru.cosmetic.server.dtos.CosmeticDto;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.repo.CosmeticRepo;
import ru.cosmetic.server.service.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Косметика", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/cosmetic")
//@PreAuthorize("hasRole('ADMIN')")
public class CosmeticController {

    private final CosmeticService cosmeticService;
    private final CosmeticActionService cosmeticActionService;
    private final BrandService brandService;
    private final CatalogService catalogService;
    private final IngredientService ingredientService;
    private final SkinTypeService skinTypeService;

    @PostMapping("/addCosmetic")
    @Operation(summary = "Добавление косметики без изображений")
    public ResponseEntity<?> addCosmetic(@RequestBody CosmeticDto cosmeticDto) {
        try {
            Cosmetic cosmetic = new Cosmetic();
            cosmetic.setName(cosmeticDto.getName());
            cosmetic.setDescription(cosmeticDto.getDescription());
            cosmetic.setCompatibility(cosmeticDto.getCompatibility());
            cosmetic.setUsageRecommendations(cosmeticDto.getUsageRecommendations());
            cosmetic.setApplicationMethod(cosmeticDto.getApplicationMethod());

            // Установка связей по ID
            cosmetic.setBrand(brandService.findById(cosmeticDto.getBrandId()));
            cosmetic.setCatalog(catalogService.findById(cosmeticDto.getCatalogId()));

            // Связь с ингредиентами, действиями, типами кожи
            cosmetic.setIngredients(ingredientService.findById(cosmeticDto.getKeyIngredientIds()));
            cosmetic.setActions(cosmeticActionService.findAllById(cosmeticDto.getActionIds()));
            cosmetic.setSkinTypes(skinTypeService.findAllById(cosmeticDto.getSkinTypeIds()));

            // Сохранение косметики (без изображений)
            Cosmetic savedCosmetic = cosmeticService.save(cosmetic);

            // Возвращаем ID новой косметики
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Косметика добавлена");
            response.put("id", savedCosmetic.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ошибка добавления косметики");
        }
    }

    @GetMapping("/getAllCosmetic")
    @Operation(summary = "Получение всей косметики")
    public ResponseEntity<?> getAllCosmetic() {
        try {
            return ResponseEntity.ok(cosmeticService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения брендов", HttpStatus.BAD_REQUEST);
        }
    }

}