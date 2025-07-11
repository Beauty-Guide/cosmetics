package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.models.Role;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.requestDto.CosmeticFilterRequest;
import ru.cosmetic.server.responseDto.UserResponse;
import ru.cosmetic.server.service.*;

import java.security.Principal;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Tag(name = "Пользовательские", description = "Доступны всем")
@RequestMapping("/api")
public class UserController {

    private final CosmeticService cosmeticService;
    private final BrandService brandService;
    private final SkinTypeService skinTypeService;
    private final CosmeticActionService cosmeticActionService;
    private final CatalogService catalogService;
    private final MinioService minioService;
    private final UserService userService;
    private final UserSearchHistoryService userSearchHistoryService;

    @PostMapping("/getCosmeticsByFilters")
    @Operation(summary = "Получение косметики по фильтрам")
    public ResponseEntity<?> getCosmeticsByFilters(@RequestBody CosmeticFilterRequest request, @RequestParam(required = false) String lang) {
        try {
            return ResponseEntity.ok(cosmeticService.getCosmeticsByFilters(request, lang));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения косметики", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getCosmeticsById/{id}")
    @Operation(summary = "Получение косметики по id")
    public ResponseEntity<?> getCosmeticsById(@PathVariable Long id, @RequestParam(required = false) String lang) {
        try {
            return ResponseEntity.ok(cosmeticService.getCosmeticById(id, lang));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения косметики с id = " + id, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getUserInfo")
    @Operation(summary = "Получение косметики по id")
    public ResponseEntity<?> getCosmeticsById(Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(UserResponse.builder()
                    .name("guest")
                    .role("guest")
                    .build());
        }

        User user;
        if (principal instanceof OAuth2AuthenticationToken oauthToken) {
            OAuth2User oAuth2User = oauthToken.getPrincipal();
            String email = oAuth2User.getAttribute("email");
            user = userService.findByEmail(email);// например, email как username
        } else if (principal instanceof UsernamePasswordAuthenticationToken token) {
            String username = token.getName();
            user = userService.findByUsername(username).orElse(null);
        }  else {
            return ResponseEntity.ok(UserResponse.builder()
                    .name("guest")
                    .role("guest")
                    .build());
        }
        if (user == null) {
            return ResponseEntity.ok(UserResponse.builder()
                    .name("guest")
                    .role("guest")
                    .build());
        }

        return ResponseEntity.ok(UserResponse.builder()
                .name(user. getUsername())
                .role(user.getRoles().stream().findFirst().map(Role::getName).orElse("user"))
                .history(userSearchHistoryService.findHistoryByUserId(user.getId()))
                .build());
    }

    @GetMapping("/deleteHistory/{id}")
    @Operation(summary = "Удаление истории поиска по id")
    public ResponseEntity<?> deleteHistory(@PathVariable Long id) {
        if (userSearchHistoryService.remove(id)) {
            return ResponseEntity.ok().build();
        } else {
            return new ResponseEntity<>("Ошибка удаления истории", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllBrands")
    @Operation(summary = "Получение всех брендов")
    public ResponseEntity<?> getAllBrands() {
        try {
            return ResponseEntity.ok(brandService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех брендов", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllSkinType")
    @Operation(summary = "Получение всех брендов")
    public ResponseEntity<?> getAllSkinType(@RequestParam(required = false) String lang) {
        try {
            return ResponseEntity.ok(skinTypeService.findAll(lang));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех типов кожи", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllCosmeticAction")
    @Operation(summary = "Получение всех брендов")
    public ResponseEntity<?> getAllCosmeticAction(@RequestParam(required = false) String lang) {
        try {
            return ResponseEntity.ok(cosmeticActionService.findAll(lang));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех действий косметики", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAllCatalog")
    @Operation(summary = "Получение всех каталогов")
    public ResponseEntity<?> getAllCatalog(@RequestParam(required = false) String lang) {
        try {
            return ResponseEntity.ok(catalogService.findAll(lang));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения всех каталогов", HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/getFile")
    @Operation(summary = "Получение изображения")
    public ResponseEntity<ByteArrayResource> getFile(@RequestParam("cosmeticId") Long cosmeticId, @RequestParam("fileName") String fileName) throws Exception {
        String format = "%s/%s";
        byte[] fileData = minioService.getFile(String.format(format, cosmeticId, fileName));
        String contentType = minioService.getContentType(fileName);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(new ByteArrayResource(fileData));
    }


}