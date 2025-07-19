package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.requestDto.CatalogRequest;
import ru.cosmetic.server.exceptions.AppError;
import ru.cosmetic.server.models.Catalog;
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
    public ResponseEntity<?> addCatalog(@RequestBody CatalogRequest catalog) {
        try {
            catalogService.save(catalog);
            return new ResponseEntity<>("Типа кожи добавлен", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/updateCatalog/{id}")
    @Operation(summary = "Обновление каталога")
    public ResponseEntity<?> updateCatalog(@RequestBody CatalogRequest catalog, @PathVariable Long id) {
        try {
            Catalog findCatalog = catalogService.findById(id);
            findCatalog.setName(catalog.getName());
            findCatalog.setNameEN(catalog.getNameEN());
            findCatalog.setNameKR(catalog.getNameKR());
            if (catalog.getParentId() != null) {
                Catalog findParentCatalog = catalogService.findById(catalog.getParentId());
                findCatalog.setParent(findParentCatalog);
            }
            catalogService.update(findCatalog);
            return new ResponseEntity<>("Типа кожи добавлен", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/deleteCatalog/{id}")
    @Operation(summary = "Удаление каталога")
    public ResponseEntity<?> deleteCatalog(@PathVariable Long id) {
        try {
            catalogService.remove(id);
            return new ResponseEntity<>("Каталог удален", HttpStatus.OK);
        } catch (Exception e) {
            if (e.getMessage().contains("fk_catalog_parent")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new AppError(
                        HttpStatus.CONFLICT.value(),
                        "Этот каталог нельзя удалить, так как он имеет подкатегории"
                ));
            }
            return new ResponseEntity<>("Ошибка при удалении каталога", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllCatalogs")
    @Operation(summary = "Получение всех каталогов")
    public ResponseEntity<?> getAllCatalogs() {
        try {
            return ResponseEntity.ok(catalogService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех каталогов", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllCatalogsForAddCosmetic")
    @Operation(summary = "Получение всех каталогов")
    public ResponseEntity<?> getAllCatalogsForAddCosmetic() {
        try {
            return ResponseEntity.ok(catalogService.getAllCatalogsForAddCosmetic());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех каталогов", HttpStatus.BAD_REQUEST);
        }
    }

}