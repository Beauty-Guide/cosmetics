package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.exceptions.AppError;
import ru.cosmetic.server.models.CosmeticAction;
import ru.cosmetic.server.service.CatalogService;
import ru.cosmetic.server.service.CosmeticActionService;
import ru.cosmetic.server.service.CosmeticService;
import ru.cosmetic.server.service.SkinTypeService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Администрация", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/cosmetic-action")
//@PreAuthorize("hasRole('ADMIN')")
public class CosmeticActionController {

    private final SkinTypeService skinTypeService;
    private final CosmeticActionService cosmeticActionService;
    private final CosmeticService cosmeticService;
    private final CatalogService catalogService;


    @PostMapping("/addCosmeticAction")
    @Operation(summary = "Добавление действия косметики")
    public ResponseEntity<?> addCosmeticAction(@RequestBody CosmeticAction cosmeticAction) {
        try {
            cosmeticActionService.save(cosmeticAction);
            return new ResponseEntity<>("Действие косметики добавлено", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Удаление действия косметики")
    @DeleteMapping("/deleteCosmeticAction/{id}")
    public ResponseEntity<?> deleteCosmeticAction(@PathVariable Long id) {
        try {
            if (cosmeticActionService.remove(id)) {
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

    @GetMapping("/getCosmeticActionById")
    @Operation(summary = "Получение всех действий косметики")
    public ResponseEntity<?> getCosmeticActionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(cosmeticActionService.findById(id));
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllCosmeticAction")
    @Operation(summary = "Получение всех действий косметики")
    public ResponseEntity<?> getAllCosmeticAction() {
        try {
            return ResponseEntity.ok(cosmeticActionService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }


}