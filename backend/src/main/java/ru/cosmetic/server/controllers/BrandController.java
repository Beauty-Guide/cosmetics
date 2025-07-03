package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.dtos.CatalogDto;
import ru.cosmetic.server.exceptions.AppError;
import ru.cosmetic.server.models.Brand;
import ru.cosmetic.server.models.Catalog;
import ru.cosmetic.server.service.BrandService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Бренды", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/brand")
//@PreAuthorize("hasRole('ADMIN')")
public class BrandController {

    private final BrandService brandService;

    @PostMapping("/addBrand")
    @Operation(summary = "Добавление бренда косметики")
    public ResponseEntity<?> addCosmeticAction(@RequestBody Brand brand) {
        try {
            brandService.save(brand);
            return new ResponseEntity<>("Действие косметики добавлено", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/updateBrand/{id}")
    @Operation(summary = "Обновление бренда")
    public ResponseEntity<?> updateBrand(@RequestBody Brand brand, @PathVariable Long id) {
        try {
            Brand findBrand = brandService.findById(id);
            findBrand.setName(brand.getName());
            brandService.save(findBrand);
            return new ResponseEntity<>("Типа кожи добавлен", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Удаление бренда")
    @DeleteMapping("/deleteBrand/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        try {
            if (brandService.remove(id)) {
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

    @GetMapping("/getBrandById")
    @Operation(summary = "Получение бренда")
    public ResponseEntity<?> getBrandById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(brandService.findById(id));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения бренда", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllBrand")
    @Operation(summary = "Получение всех брендов")
    public ResponseEntity<?> getAllBrand() {
        try {
            return ResponseEntity.ok(brandService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения брендов", HttpStatus.BAD_REQUEST);
        }
    }

}