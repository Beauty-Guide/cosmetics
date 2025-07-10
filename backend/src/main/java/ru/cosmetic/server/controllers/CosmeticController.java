package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.exceptions.AppError;
import ru.cosmetic.server.models.Catalog;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.requestDto.CosmeticAddRequest;
import ru.cosmetic.server.requestDto.CosmeticFilterRequest;
import ru.cosmetic.server.requestDto.CosmeticUpdateCatalogRequest;
import ru.cosmetic.server.service.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Косметика", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/cosmetic")
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public class CosmeticController {

    private final CosmeticService cosmeticService;
    private final CosmeticActionService cosmeticActionService;
    private final BrandService brandService;
    private final CatalogService catalogService;
    private final IngredientService ingredientService;
    private final SkinTypeService skinTypeService;
    private final CosmeticImageService cosmeticImageService;
    private final MinioService minioService;

    @PostMapping("/addCosmetic")
    @Operation(summary = "Добавление косметики без изображений")
    public ResponseEntity<?> addCosmetic(@RequestBody CosmeticAddRequest request) {
        try {
            Cosmetic cosmetic = new Cosmetic();
            cosmetic.setName(request.getName());
            cosmetic.setCompatibility(request.getCompatibility());
            cosmetic.setCompatibilityEN(request.getCompatibilityEN());
            cosmetic.setCompatibilityKR(request.getCompatibilityKR());
            cosmetic.setUsageRecommendations(request.getUsageRecommendations());
            cosmetic.setUsageRecommendationsEN(request.getUsageRecommendationsEN());
            cosmetic.setUsageRecommendationsKR(request.getUsageRecommendationsKR());
            cosmetic.setApplicationMethod(request.getApplicationMethod());
            cosmetic.setApplicationMethodEN(request.getApplicationMethodEN());
            cosmetic.setApplicationMethodKR(request.getApplicationMethodKR());
            cosmetic.setCreatedDate(LocalDateTime.now());
            cosmetic.setRating(request.getRating());

            // Установка связей по ID
            cosmetic.setBrand(brandService.findById(request.getBrandId()));
            cosmetic.setCatalog(catalogService.findById(request.getCatalogId()));

            // Связь с ингредиентами, действиями, типами кожи
            cosmetic.setIngredients(ingredientService.findById(request.getKeyIngredientIds()));
            cosmetic.setActions(cosmeticActionService.findAllById(request.getActionIds()));
            cosmetic.setSkinTypes(skinTypeService.findAllById(request.getSkinTypeIds()));

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
    public ResponseEntity<?> getAllCosmetic(@RequestParam(required = false) String lang) {
        try {
            CosmeticFilterRequest cosmeticFilterRequest = new CosmeticFilterRequest();
            cosmeticFilterRequest.setSortBy("id");
            cosmeticFilterRequest.setSortDirection("ASC");
            Long countOfCosmetics = cosmeticService.getCountOfCosmetics();
            cosmeticFilterRequest.setSize(countOfCosmetics);
            return ResponseEntity.ok(cosmeticService.getCosmeticsByFilters(cosmeticFilterRequest, lang));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения брендов", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/updateCosmetic/{id}")
    @Operation(summary = "Обновление косметики")
    public ResponseEntity<?> updateCosmetic(@RequestBody CosmeticAddRequest request, @PathVariable Long id) {
        try {
            Cosmetic findCosmetic = cosmeticService.findById(id);
            findCosmetic.setName(request.getName());
            findCosmetic.setCompatibility(request.getCompatibility());
            findCosmetic.setCompatibilityEN(request.getCompatibilityEN());
            findCosmetic.setCompatibilityKR(request.getCompatibilityKR());
            findCosmetic.setUsageRecommendations(request.getUsageRecommendations());
            findCosmetic.setUsageRecommendationsEN(request.getUsageRecommendationsEN());
            findCosmetic.setUsageRecommendationsKR(request.getUsageRecommendationsKR());
            findCosmetic.setApplicationMethod(request.getApplicationMethod());
            findCosmetic.setApplicationMethodEN(request.getApplicationMethodEN());
            findCosmetic.setApplicationMethodKR(request.getApplicationMethodKR());
            findCosmetic.setRating(request.getRating());
            findCosmetic.setBrand(brandService.findById(request.getBrandId()));
            findCosmetic.setIngredients(ingredientService.findById(request.getKeyIngredientIds()));
            findCosmetic.setCatalog(catalogService.findById(request.getCatalogId()));
            findCosmetic.setActions(cosmeticActionService.findAllById(request.getActionIds()));
            findCosmetic.setSkinTypes(skinTypeService.findAllById(request.getSkinTypeIds()));
            for (String imageId : request.getImagesForDeletion()) {
                cosmeticImageService.remove(UUID.fromString(imageId));
                minioService.deleteFile(findCosmetic.getId() + "/" + findCosmetic.getId() + "_" + imageId);
            }

            cosmeticService.save(findCosmetic);
            return new ResponseEntity<>("Косметика обновлена", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/updateCosmeticCatalog/{cosmeticId}")
    public ResponseEntity<Void> updateCosmeticCatalog(
            @PathVariable Long cosmeticId,
            @RequestBody CosmeticUpdateCatalogRequest request) {
        Cosmetic cosmetic = cosmeticService.findById(cosmeticId);
        if (cosmetic != null) {
            Catalog catalog = catalogService.findById(request.getCatalogId());
            if (catalog != null) {
                cosmetic.setCatalog(catalog);
                cosmeticService.save(cosmetic);
            }
        }
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Удаление косметики")
    @DeleteMapping("/deleteCosmetic/{id}")
    public ResponseEntity<?> deleteCosmetic(@PathVariable Long id) {
        try {
            if (cosmeticService.remove(id)) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            if (e.getMessage().contains("fk_cosmetic_brand")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new AppError(
                        HttpStatus.BAD_REQUEST.value(),
                        "Этот бренд используется в косметике"
                ));
            }
            return new ResponseEntity<>("Ошибка удаление бренда", HttpStatus.BAD_REQUEST);
        }
    }
}