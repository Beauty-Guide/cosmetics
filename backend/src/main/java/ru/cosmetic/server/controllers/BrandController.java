package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.exceptions.AppError;
import ru.cosmetic.server.models.Brand;
import ru.cosmetic.server.service.BrandService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Бренды>", description = "Доступен только авторизованным пользователям с ролью ADMIN")
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

    @Operation(summary = "Удаление бренда косметики")
    @DeleteMapping("/deleteBrand/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        try {
            if (brandService.remove(id)) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            if (e.getMessage().contains("fk_cosmetic_action_action")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new AppError(
                        HttpStatus.BAD_REQUEST.value(),
                        "Это действие используется в косметике"
                ));
            }
            return new ResponseEntity<>("Ошибка удаление действия косметики", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getBrandById")
    @Operation(summary = "Получение всех действий косметики")
    public ResponseEntity<?> getBrandById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(brandService.findById(id));
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllBrand")
    @Operation(summary = "Получение всех действий косметики")
    public ResponseEntity<?> getAllBrand() {
        try {
            return ResponseEntity.ok(brandService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

}