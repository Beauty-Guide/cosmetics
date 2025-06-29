package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.dtos.CatalogDto;
import ru.cosmetic.server.service.CatalogService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Каталоги", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/catalog")
//@PreAuthorize("hasRole('ADMIN')")
public class CatalogController {

    private final CatalogService catalogService;

    @PostMapping("/addCatalog")
    @Operation(summary = "Добавление каталога")
    public ResponseEntity<?> addCatalog(@RequestBody CatalogDto catalog) {
        try {
            catalogService.save(catalog);
            return new ResponseEntity<>("Типа кожи добавлен", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllCatalogs")
    @Operation(summary = "Получение всех каталогов")
    public ResponseEntity<?> getAllCatalogs() {
        try {
            return ResponseEntity.ok(catalogService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка", HttpStatus.BAD_REQUEST);
        }
    }


}