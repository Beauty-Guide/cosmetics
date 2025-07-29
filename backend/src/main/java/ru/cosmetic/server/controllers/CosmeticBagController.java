package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.requestDto.CosmeticBagRequest;
import ru.cosmetic.server.responseDto.CosmeticBagResponse;
import ru.cosmetic.server.responseDto.CosmeticBagWithOwnerStatusResponse;
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
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody CosmeticBagRequest request, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>("Ошибка обновления косметички", HttpStatus.BAD_REQUEST);
        } else {
            UUID uuid = UUID.fromString(id.replace("cosmeticBag_", ""));
            User user = userService.findByEmail(principal.getName());
            CosmeticBagResponse cosmeticBag = cosmeticBagService.findById(uuid);
            if (user.getId().equals(cosmeticBag.getOwnerId())){
                cosmeticBagService.update(uuid, request);
                return new ResponseEntity<>("Косметичка обновлена", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Ошибка обновления косметички", HttpStatus.BAD_REQUEST);
            }
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Пометка удаленной косметички")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<?> delete(@PathVariable String id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>("Ошибка пометки удаления косметички", HttpStatus.BAD_REQUEST);
        } else {
            UUID uuid = UUID.fromString(id.replace("cosmeticBag_", ""));
            User user = userService.findByEmail(principal.getName());
            CosmeticBagResponse cosmeticBag = cosmeticBagService.findById(uuid);
            if (user.getId().equals(cosmeticBag.getOwnerId())){
                cosmeticBagService.delete(uuid);
                return new ResponseEntity<>("Косметичка помечена удаленной", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Ошибка пометки удаления косметички", HttpStatus.BAD_REQUEST);
            }
        }
    }

    @PostMapping("/{id}/cosmetics/{cosmeticId}")
    @Operation(summary = "Добавление косметики в косметичку")
    public ResponseEntity<?> addCosmetic(@PathVariable String id, @PathVariable Long cosmeticId, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>("Ошибка добавления косметики в косметичку", HttpStatus.BAD_REQUEST);
        } else {
            UUID uuid = UUID.fromString(id.replace("cosmeticBag_", ""));
            User user = userService.findByEmail(principal.getName());
            CosmeticBagResponse cosmeticBag = cosmeticBagService.findById(uuid);
            if (user.getId().equals(cosmeticBag.getOwnerId())){
                cosmeticBagService.addCosmeticToBag(uuid, cosmeticId);
                return new ResponseEntity<>("Косметика добавлена в косметичку", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Ошибка добавления косметики в косметичку", HttpStatus.BAD_REQUEST);
            }
        }
    }

    @DeleteMapping("/{id}/cosmetics/{cosmeticId}")
    @Operation(summary = "Удаление косметики из косметички")
    public ResponseEntity<?> removeCosmetic(@PathVariable String id, @PathVariable Long cosmeticId, Principal principal) {
        try {
            if (principal == null) {
                return new ResponseEntity<>("Ошибка удаления косметики из косметички", HttpStatus.BAD_REQUEST);
            } else {
                UUID uuid = UUID.fromString(id.replace("cosmeticBag_", ""));
                User user = userService.findByEmail(principal.getName());
                CosmeticBagResponse cosmeticBag = cosmeticBagService.findById(uuid);
                if (user.getId().equals(cosmeticBag.getOwnerId())){
                    cosmeticBagService.removeCosmeticFromBag(uuid, cosmeticId);
                    return new ResponseEntity<>("Косметика удалена из косметички", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Ошибка удаления косметики из косметички", HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка удаления косметики из косметички", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    @Operation(summary = "Получение своих косметичек")
    public ResponseEntity<?> list(Principal principal, @RequestParam(required = false) Long cosmeticId) {
        try {
            User user = userService.findByEmail(principal.getName());
            return ResponseEntity.ok(cosmeticBagService.listByOwner(user.getId(), cosmeticId));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения своих косметичек", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getCosmeticBag/{id}")
    @Operation(summary = "Получение косметички по id")
    public ResponseEntity<?> getCosmeticBag(@PathVariable String id, Principal principal) {
        try {
            boolean isOwner = false;
            UUID uuid = UUID.fromString(id.replace("cosmeticBag_", ""));
            if (principal != null) {
                User user = userService.findByEmail(principal.getName());
                CosmeticBagResponse cosmeticBag = cosmeticBagService.findById(uuid);
                if (user.getId().equals(cosmeticBag.getOwnerId())){
                    isOwner = true;
                }
            }
            return ResponseEntity.ok(CosmeticBagWithOwnerStatusResponse.builder().isOwner(isOwner).cosmeticBag(cosmeticBagService.findById(uuid)).build());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения своих косметичек", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "Поставить лайк косметичке")
    public ResponseEntity<?> likeBag(@PathVariable String id, Principal principal) {
        try {
            UUID uuid = UUID.fromString(id.replace("cosmeticBag_", ""));
            favoriteBagService.likeBag(uuid, principal);
            return new ResponseEntity<>("Косметичка добавлена в избранные", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка добавления косметички в избранные", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}/like")
    @Operation(summary = "Снять лайк с косметички")
    public ResponseEntity<?> unlikeBag(@PathVariable String id, Principal principal) {
        try {
            UUID uuid = UUID.fromString(id.replace("cosmeticBag_", ""));
            favoriteBagService.unlikeBag(uuid, principal);
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