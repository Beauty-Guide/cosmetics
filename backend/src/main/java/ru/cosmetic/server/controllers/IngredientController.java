package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.exceptions.AppError;
import ru.cosmetic.server.models.Ingredient;
import ru.cosmetic.server.models.SkinType;
import ru.cosmetic.server.service.IngredientService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Ингредиенты", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/ingredient")
//@PreAuthorize("hasRole('ADMIN')")
public class IngredientController {

    private final IngredientService ingredientService;

    @PostMapping("/addIngredient")
    @Operation(summary = "Добавление ингредиента")
    public ResponseEntity<?> addIngredient(@RequestBody Ingredient ingredient) {
        try {
            ingredientService.save(ingredient);
            return new ResponseEntity<>("Ингредиент добавлен", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ингредиент не добавлен", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/updateIngredient/{id}")
    @Operation(summary = "Обновление ингредиента")
    public ResponseEntity<?> updateIngredient(@RequestBody Ingredient ingredient, @PathVariable Long id) {
        try {
            Ingredient findIngredient = ingredientService.findById(id);
            findIngredient.setName(ingredient.getName());
            ingredientService.save(findIngredient);
            return new ResponseEntity<>("Ингредиент обновлен", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Удаление ингредиента")
    @DeleteMapping("/deleteIngredient/{id}")
    public ResponseEntity<?> deleteIngredient(@PathVariable Long id) {
        try {
            if (ingredientService.remove(id)) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            if (e.getMessage().contains("fk_cosmetic_ingredient_ingredient")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new AppError(
                        HttpStatus.BAD_REQUEST.value(),
                        "Этот ингредиент используется в косметике"
                ));
            }
            return new ResponseEntity<>("Ошибка удаление ингредиента", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getIngredientById")
    @Operation(summary = "Получение ингредиента")
    public ResponseEntity<?> getIngredientById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ingredientService.findById(id));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения ингредиента", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllIngredient")
    @Operation(summary = "Получение всех ингредиентов")
    public ResponseEntity<?> getAllIngredient() {
        try {
            return ResponseEntity.ok(ingredientService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения ингредиентов", HttpStatus.BAD_REQUEST);
        }
    }

}