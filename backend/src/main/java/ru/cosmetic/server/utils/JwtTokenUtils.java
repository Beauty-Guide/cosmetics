package ru.cosmetic.server.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.cosmetic.server.models.Role;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.service.UserService;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.*;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenUtils {

    @Value("${token.signing.key}")
    private String jwtSigningKey;

    @Value("${token.lifetime}")
    private Duration jwtLifetime;

    private final UserService userService;

    public String generateAccessToken(String email) {
        return buildToken(email);
    }

    public String generateRefreshToken(String email) {
        return buildToken(email);
    }

    public boolean validateRefreshToken(String refreshToken) {
        try {
            JWT.require(Algorithm.HMAC256("refreshSecretKey"))
                    .build()
                    .verify(refreshToken);
            return true;
        } catch (JWTVerificationException exception) {
            return false;
        }
    }

    private String buildToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        User user = userService.findByEmail(email);
        if (user != null) {
            List<String> rolesList = new ArrayList<>();
            if (user.getRoles() != null) {
                for (Role role : user.getRoles()) {
                    rolesList.add(role.getName());
                }
            }
            claims.put("roles", rolesList);
        } else {
            claims.put("roles", Collections.emptyList());
        }
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + jwtLifetime.toMillis());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    public void sendRefreshToken(String refreshToken, HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/api/refresh");
        cookie.setMaxAge((int) Duration.ofDays(7).getSeconds());
        response.addCookie(cookie);
    }

    /**
     * Извлечение имени пользователя из токена
     *
     * @param token токен
     * @return имя пользователя
     */
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Извлечение ролей из токена
     *
     * @param token токен
     * @return роли
     */
    public List<String> getRoles(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }

    /**
     * Получение ключа для подписи токена
     *
     * @return ключ
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSigningKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Извлечение данных из токена
     *
     * @param token          токен
     * @param claimsResolver функция извлечения данных
     * @param <T>            тип данных
     * @return данные
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Извлечение всех данных из токена
     *
     * @param token токен
     * @return данные
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token, String username) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return extractUserName(token).equals(username);
        } catch (Exception e) {
            return false;
        }
    }
}
