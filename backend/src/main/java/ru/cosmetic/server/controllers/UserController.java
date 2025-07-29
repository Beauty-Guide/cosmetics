package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.CacheControl;
import ru.cosmetic.server.dtos.LocationData;
import ru.cosmetic.server.enums.ActionType;
import ru.cosmetic.server.models.Role;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.requestDto.CosmeticFilterRequest;
import ru.cosmetic.server.responseDto.UserResponse;
import ru.cosmetic.server.service.*;
import ru.cosmetic.server.utils.JwtTokenUtils;

import java.security.Principal;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

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
    private final JwtTokenUtils jwtTokenUtils;
    private final AnalyticsService analyticsService;
    private final LocationService locationService;


    @PostMapping("/getCosmeticsByFilters")
    @Operation(summary = "Получение косметики по фильтрам")
    public ResponseEntity<?> getCosmeticsByFilters(@RequestBody CosmeticFilterRequest request, @RequestParam(required = false) String lang, Principal principal) {
        try {
            User user = null;
            if (principal != null) {
                user  = getUser(principal);
            }
            String location = user != null ? user.getLocation() : null;
            boolean hasData = (request.getBrandIds() != null && !request.getBrandIds().isEmpty()) ||
                    (request.getSkinTypeIds() != null && !request.getSkinTypeIds().isEmpty()) ||
                    (request.getActionIds() != null && !request.getActionIds().isEmpty()) ||
                    (request.getName() != null && !request.getName().isEmpty());
            if (hasData) {
                AnalyticsRequest analyticsRequest = AnalyticsRequest.builder()
                        .action(ActionType.SEARCH_FILTER)
                        .brandIds(request.getBrandIds())
                        .skinTypeIds(request.getSkinTypeIds())
                        .actionIds(request.getActionIds())
                        .query(request.getName())
                        .location(location)
                        .build();
                analyticsService.save(analyticsRequest, user);
            }

            return ResponseEntity.ok(cosmeticService.getCosmeticsForCatalogByFilters(request, lang, user, false));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения косметики", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getCosmeticsById/{id}")
    @Operation(summary = "Получение косметики по id")
    public ResponseEntity<?> getCosmeticsById(@PathVariable Long id,
                                              @RequestParam(required = false) String lang,
                                              Principal principal,
                                              @RequestParam(required = false) boolean isAllData) {
        try {
            User user = null;
            if (principal != null) {
                user  = getUser(principal);
            }
            String location = user != null ? user.getLocation() : null;
            analyticsService.save(AnalyticsRequest.builder().cosmeticId(id).action(ActionType.VIEW).location(location).build(), user);
            return ResponseEntity.ok(cosmeticService.getCosmeticById(id, lang, isAllData));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения косметики с id = " + id, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getUserInfo")
    @Operation(summary = "Получение информации о пользователе")
    public ResponseEntity<?> getUserInfo(
            @RequestHeader(name = "Authorization", required = false) String authHeader,
            @RequestParam(required = false) String lang,
            HttpServletRequest request) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(buildGuestResponse(lang));
        }
        String refreshToken = authHeader.substring(7);
        if (!jwtTokenUtils.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Refresh token is invalid or expired"));
        }
        String email;
        try {
            email = jwtTokenUtils.extractUserName(refreshToken);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Could not extract user from token"));
        }
        User user = userService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "User not found"));
        }
        if (user.getLocation() == null) {
            LocationData locationData = locationService.getLocation(request, user.getEmail());
            user.setLocation(locationData.getCountry() + ", " + locationData.getCity());
            userService.update(user);
        }
        return ResponseEntity.ok(UserResponse.builder()
                .name(user.getUsername())
                .role(user.getRoles().stream().findFirst().map(Role::getName).orElse("user"))
                .history(userSearchHistoryService.findHistoryByUserId(user.getId()))
                .build());
    }

    private User getUser(Principal principal) {
       return userService.findByEmail(principal.getName());
    }

    private UserResponse buildGuestResponse(String lang) {
        return UserResponse.builder()
                .name(getGuestName(lang))
                .role("guest")
                .build();
    }

    private String getGuestName(String lang) {
        if ("en".equals(lang)) {
            return "Guest";
        } else if ("ko".equals(lang)) {
            return "손님";
        } else {
            return "Гость";
        }
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

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setCacheControl(CacheControl
                .maxAge(365, TimeUnit.DAYS)
                .cachePublic()
                .immutable());

        return ResponseEntity.ok()
                .headers(headers)
                .body(new ByteArrayResource(fileData));
    }


}