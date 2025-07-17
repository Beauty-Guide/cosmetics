package ru.cosmetic.server.controllers;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.cosmetic.server.dtos.JwtResponse;
import ru.cosmetic.server.utils.JwtTokenUtils;

@RestController
@RequestMapping("/api/refresh")
@RequiredArgsConstructor
public class RefreshController {

    private final JwtTokenUtils jwtTokenUtils;

    @PostMapping
    public ResponseEntity<JwtResponse> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken == null || !jwtTokenUtils.validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        String email = jwtTokenUtils.extractUserName(refreshToken);
        String newAccessToken = jwtTokenUtils.generateAccessToken(email);
        String newRefreshToken = jwtTokenUtils.generateRefreshToken(email);
        jwtTokenUtils.sendRefreshToken(newRefreshToken, response);
        return ResponseEntity.ok(new JwtResponse(newAccessToken));
    }
}

