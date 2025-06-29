package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.exceptions.AppError;
import ru.cosmetic.server.models.SkinType;
import ru.cosmetic.server.service.SkinTypeService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Администрация", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/skin-type")
//@PreAuthorize("hasRole('ADMIN')")
public class SkinTypeController {

    private final SkinTypeService skinTypeService;

    @PostMapping("/addSkinType")
    @Operation(summary = "Добавление типа кожи")
    public ResponseEntity<?> addSkinType(@RequestBody SkinType skinType) {
        try {
            skinTypeService.save(skinType);
            return new ResponseEntity<>("Типа кожи добавлен", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Типа кожи не добавлен", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Удаление типа кожи")
    @DeleteMapping("/deleteSkinType/{id}")
    public ResponseEntity<?> deleteSkinType(@PathVariable Long id) {
        try {
            if (skinTypeService.remove(id)) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            if (e.getMessage().contains("fk_cosmetic_skin_cosmetic")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new AppError(
                        HttpStatus.BAD_REQUEST.value(),
                        "Этот тип кожи используется в косметике"
                ));
            }
            return new ResponseEntity<>("Ошибка удаление типа кожи", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getSkinTypeById")
    @Operation(summary = "Получение всех типов кожи")
    public ResponseEntity<?> getSkinTypeById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(skinTypeService.findById(id));
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllSkinType")
    @Operation(summary = "Получение всех типов кожи")
    public ResponseEntity<?> getAllSkinType() {
        try {
            return ResponseEntity.ok(skinTypeService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

}