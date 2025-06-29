package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.dtos.CatalogDto;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.service.CatalogService;
import ru.cosmetic.server.service.CosmeticActionService;
import ru.cosmetic.server.service.CosmeticService;
import ru.cosmetic.server.service.SkinTypeService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Администрация", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin")
//@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final SkinTypeService skinTypeService;
    private final CosmeticActionService cosmeticActionService;
    private final CosmeticService cosmeticService;
    private final CatalogService catalogService;

    @GetMapping("/")
    @Operation(summary = "Доступен только авторизованным пользователям с ролью ADMIN")
    public String exampleAdmin() {
        return "Hello, admin!";
    }

    @PostMapping("/addCosmetic")
    @Operation(summary = "Добавление косметики")
    public ResponseEntity<?> addCosmetic(@RequestBody Cosmetic cosmetic) {
        try {
            cosmeticService.save(cosmetic);
            return new ResponseEntity<>("Косметика добавлена", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Косметика не добавлена", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/addCatalog")
    @Operation(summary = "Добавление каталога")
    public ResponseEntity<?> addCatalog(@RequestBody CatalogDto catalog) {
        try {
            catalogService.save(catalog);
            return new ResponseEntity<>("Типа кожи добавлен", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Типа кожи не добавлен", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllCatalogs")
    @Operation(summary = "Получение всех каталогов")
    public ResponseEntity<?> getAllCatalogs() {
        try {
            return ResponseEntity.ok(catalogService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Типа кожи не добавлен", HttpStatus.BAD_REQUEST);
        }
    }


}