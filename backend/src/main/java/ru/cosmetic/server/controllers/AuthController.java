package ru.cosmetic.server.controllers;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.cosmetic.server.dtos.JwtRequest;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.requestDto.UserRequest;
import ru.cosmetic.server.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import ru.cosmetic.server.service.RoleService;
import ru.cosmetic.server.service.UserService;
import ru.cosmetic.server.utils.JwtTokenUtils;

import java.io.IOException;
import java.util.Collections;
import java.util.Locale;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@Tag(name = "Аутентификация")
public class AuthController {
    private final AuthenticationService authService;
    private final MessageSource messageSource;
    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtils jwtTokenUtils;

    @Operation(summary = "Авторизация пользователя")
    @PostMapping("/auth")
    public ResponseEntity<?> createAuthToken(@RequestBody JwtRequest authRequest) {
        return authService.createAuthToken(authRequest);
    }

    @Operation(summary = "Регистрация нового пользователя")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequest userRequest, @RequestParam(required = false) String lang) {
        Locale locale = parseLocale(lang);
        if (!userRequest.getPassword().equals(userRequest.getConfirmPassword())) {
            String error = messageSource.getMessage("password.not.match", null, locale);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", error));
        }
        if (userService.findByEmail(userRequest.getEmail()) != null) {
            String error = messageSource.getMessage("email.taken", null, locale);
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", error));
        }
        try {
            User user = new User();
            user.setUsername(userRequest.getUsername());
            user.setEmail(userRequest.getEmail());
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
            user.setProvider("local");
            user.setRoles(Collections.singleton(roleService.getUserRole()));
            if (userService.createUser(user)) {
                String token = jwtTokenUtils.generateToken(user.getEmail());
                String successMessage = messageSource.getMessage("register.success", null, locale);
                return ResponseEntity.ok()
                        .body(Map.of("token", token, "message", successMessage));
            } else {
                String errorMessage = messageSource.getMessage("register.failed", null, locale);
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", errorMessage));
            }
        } catch (Exception e) {
            String errorMessage = messageSource.getMessage("register.error", null, locale);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", errorMessage));
        }
    }

    // Парсинг строки вида "ru" или "ko" в объект Locale
    private Locale parseLocale(String lang) {
        if (lang == null || lang.isBlank()) {
            return Locale.getDefault(); // По умолчанию системный язык
        }
        String[] parts = lang.split("_");
        if (parts.length == 2) {
            return new Locale(parts[0], parts[1]);
        } else {
            return new Locale(lang); // Например: "ru", "en", "ko"
        }
    }

    @GetMapping("/auth-redirect")
    public void handleRedirect(@RequestParam String token, HttpServletResponse response) throws IOException {
        response.sendRedirect("http://localhost:3000/login-success?token=" + token);
    }
}