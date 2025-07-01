package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.exceptions.AppError;
import ru.cosmetic.server.models.Ingredient;
import ru.cosmetic.server.service.IngredientService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Ингредиенты", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/ingredient")
//@PreAuthorize("hasRole('ADMIN')")
public class IngredientController {

    private final IngredientService ingredientService;

    @PostMapping("/addIngredient")
    @Operation(summary = "Добавление бренда косметики")
    public ResponseEntity<?> addIngredient(@RequestBody Ingredient ingredient) {
        try {
            ingredientService.save(ingredient);
            return new ResponseEntity<>("Действие косметики добавлено", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Удаление бренда косметики")
    @DeleteMapping("/deleteIngredient/{id}")
    public ResponseEntity<?> deleteIngredient(@PathVariable Long id) {
        try {
            if (ingredientService.remove(id)) {
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

    @GetMapping("/getIngredientById")
    @Operation(summary = "Получение всех действий косметики")
    public ResponseEntity<?> getIngredientById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ingredientService.findById(id));
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllIngredient")
    @Operation(summary = "Получение всех действий косметики")
    public ResponseEntity<?> getAllIngredient() {
        try {
            return ResponseEntity.ok(ingredientService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Действие косметики не добавлено", HttpStatus.BAD_REQUEST);
        }
    }

}