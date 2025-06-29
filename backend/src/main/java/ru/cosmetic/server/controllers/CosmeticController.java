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
import ru.cosmetic.server.service.CosmeticService;

@RestController
@RequiredArgsConstructor
@Tag(name = "Косметика", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/cosmetic")
//@PreAuthorize("hasRole('ADMIN')")
public class CosmeticController {

    private final CosmeticService cosmeticService;

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
}