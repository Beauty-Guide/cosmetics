package ru.cosmetic.server.controllers;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.cosmetic.server.utils.JwtTokenUtils;

@RestController
@RequestMapping("/api/refresh")
@RequiredArgsConstructor
public class RefreshController {

    private final JwtTokenUtils jwtTokenUtils;

    @PostMapping()
    public ResponseEntity<String> refreshToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный токен");
        }

        String oldToken = authHeader.substring("Bearer ".length());

        try {
            String username = jwtTokenUtils.extractUserName(oldToken);
            if (username == null || !jwtTokenUtils.isTokenValid(oldToken, username)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Токен истёк");
            }

            String newToken = jwtTokenUtils.generateToken(username);
            return ResponseEntity.ok(newToken);

        } catch (ExpiredJwtException e) {
            String username = e.getClaims().getSubject();
            String newToken = jwtTokenUtils.generateToken(username);
            return ResponseEntity.ok(newToken);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ошибка при обновлении токена");
        }
    }
}

