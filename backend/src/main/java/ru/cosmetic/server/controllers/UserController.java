package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.requestDto.CosmeticFilterRequest;
import ru.cosmetic.server.service.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Пользовательские", description = "Доступны всем")
@RequestMapping("/api")
public class UserController {

    private final CosmeticService cosmeticService;
    private final BrandService brandService;
    private final SkinTypeService skinTypeService;
    private final CosmeticActionService cosmeticActionService;
    private final CatalogService catalogService;

    @PostMapping("/getCosmeticsByFilters")
    @Operation(summary = "Получение косметики по фильтрам")
    public ResponseEntity<?> getCosmeticsByFilters(@RequestBody CosmeticFilterRequest request) {
        try {
            return ResponseEntity.ok(cosmeticService.getCosmeticsByFilters(request));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения косметики", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getCosmeticsById/{id}")
    @Operation(summary = "Получение косметики по id")
    public ResponseEntity<?> getCosmeticsById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(cosmeticService.getCosmeticById(id));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения косметики с id = " + id, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllBrands")
    @Operation(summary = "Получение всех брендов")
    public ResponseEntity<?> getAllBrands() {
        try {
            return ResponseEntity.ok(brandService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех брендов", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllSkinType")
    @Operation(summary = "Получение всех брендов")
    public ResponseEntity<?> getAllSkinType() {
        try {
            return ResponseEntity.ok(skinTypeService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех типов кожи", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllCosmeticAction")
    @Operation(summary = "Получение всех брендов")
    public ResponseEntity<?> getAllCosmeticAction() {
        try {
            return ResponseEntity.ok(cosmeticActionService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех действий косметики", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllCatalog")
    @Operation(summary = "Получение всех каталогов")
    public ResponseEntity<?> getAllCatalog() {
        try {
            return ResponseEntity.ok(cosmeticActionService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех каталогов", HttpStatus.BAD_REQUEST);
        }
    }

}