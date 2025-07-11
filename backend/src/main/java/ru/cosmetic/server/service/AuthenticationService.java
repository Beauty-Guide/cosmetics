package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import ru.cosmetic.server.dtos.JwtRequest;
import ru.cosmetic.server.dtos.JwtResponse;
import ru.cosmetic.server.utils.JwtTokenUtils;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserService userService;
    private final JwtTokenUtils jwtTokenUtils;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    /**
     * Аутентификация пользователя
     *
     * @param authRequest данные пользователя
     * @return токен
     */
    public ResponseEntity<?> createAuthToken(@RequestBody JwtRequest authRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        } catch (Exception e) {
            return new ResponseEntity<>("Неправильная почта или пароль", HttpStatus.UNAUTHORIZED);
        }
        String token = jwtTokenUtils.generateToken(authRequest.getEmail());
        return ResponseEntity.ok(new JwtResponse(token));
    }

}
