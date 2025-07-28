package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.requestDto.CosmeticBagRequest;
import ru.cosmetic.server.service.CosmeticBagService;
import ru.cosmetic.server.service.FavoriteBagService;
import ru.cosmetic.server.service.UserService;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/bags")
@Tag(name = "Косметички", description = "Доступен только авторизованным пользователям")

@RequiredArgsConstructor
public class CosmeticBagController {

    private final CosmeticBagService cosmeticBagService;
    private final FavoriteBagService favoriteBagService;
    private final UserService userService;

    @PostMapping("/createBug")
    @Operation(summary = "Создание косметички")
    public ResponseEntity<?> create(@RequestBody CosmeticBagRequest request, Principal principal) {
        try {
            User creater = userService.findByEmail(principal.getName());
            cosmeticBagService.create(request, creater);
            return new ResponseEntity<>("Косметичка создана", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка создания косметички", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновление косметички")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody CosmeticBagRequest request, Principal principal) {
        try {
            cosmeticBagService.update(id, request);
            return new ResponseEntity<>("Косметичка обновлена", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка обновления косметички", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Пометка удаленной косметички")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        try {
            cosmeticBagService.delete(id);
            return new ResponseEntity<>("Косметичка помечена удаленной", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка пометки удаления косметички", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/cosmetics/{cosmeticId}")
    @Operation(summary = "Добавление косметики в косметичку")
    public ResponseEntity<?> addCosmetic(@PathVariable UUID id, @PathVariable Long cosmeticId) {
        try {
            cosmeticBagService.addCosmeticToBag(id, cosmeticId);
            return new ResponseEntity<>("Косметика добавлена в косметичку", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка добавления косметики в косметичку", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}/cosmetics/{cosmeticId}")
    @Operation(summary = "Удаление косметики из косметички")
    public ResponseEntity<?> removeCosmetic(@PathVariable String id, @PathVariable Long cosmeticId) {
        try {
            UUID uuid = UUID.fromString(id.replace("cosmeticBag_", ""));
            cosmeticBagService.removeCosmeticFromBag(uuid, cosmeticId);
            return new ResponseEntity<>("Косметика удалена из косметички", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка удаления косметики из косметички", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    @Operation(summary = "Получение своих косметичек")
    public ResponseEntity<?> list(Principal principal, @RequestParam(required = false) Long cosmeticId) {
        try {
            User user = userService.findByEmail(principal.getName());
            return ResponseEntity.ok(cosmeticBagService.listByOwner(user.getId(),cosmeticId));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения своих косметичек", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getCosmeticBag/{id}")
    @Operation(summary = "Получение косметички по id")
    public ResponseEntity<?> getCosmeticBag(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id.replace("cosmeticBag_", ""));
            return ResponseEntity.ok(cosmeticBagService.findById(uuid));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения своих косметичек", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "Поставить лайк косметичке")
    public ResponseEntity<?> likeBag(@PathVariable UUID id, Principal principal) {
        try {
            favoriteBagService.likeBag(id, principal);
            return new ResponseEntity<>("Косметичка добавлена в избранные", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка добавления косметички в избранные", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}/like")
    @Operation(summary = "Снять лайк с косметички")
    public ResponseEntity<?> unlikeBag(@PathVariable UUID id, Principal principal) {
        try {
            favoriteBagService.unlikeBag(id, principal);
            return new ResponseEntity<>("Косметичка удалена из избранных", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка удаления косметички из избранных", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/liked")
    @Operation(summary = "Мои избранные косметички")
    public ResponseEntity<?> likedBags(Principal principal) {
        try {
            return ResponseEntity.ok(favoriteBagService.listLikedBags(principal));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения избранных косметичек", HttpStatus.BAD_REQUEST);
        }
    }
}