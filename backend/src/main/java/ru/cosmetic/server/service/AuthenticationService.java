package ru.cosmetic.server.service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.dtos.JwtRequest;
import ru.cosmetic.server.dtos.JwtResponse;
import ru.cosmetic.server.utils.JwtTokenUtils;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final JwtTokenUtils jwtTokenUtils;
    private final AuthenticationManager authenticationManager;

    public ResponseEntity<JwtResponse> createAuthToken(JwtRequest authRequest, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        } catch (AuthenticationException e) {
            throw new RuntimeException("Неправильная почта или пароль");
        }
        String accessToken = jwtTokenUtils.generateAccessToken(authRequest.getEmail());
        String refreshToken = jwtTokenUtils.generateRefreshToken(authRequest.getEmail());
        jwtTokenUtils.sendRefreshToken(refreshToken, response);
        return ResponseEntity.ok(new JwtResponse(accessToken));
    }

}
