package ru.cosmetic.server.service;

import ru.cosmetic.server.dtos.JwtRequest;
import ru.cosmetic.server.dtos.JwtResponse;
import ru.cosmetic.server.utils.JwtTokenUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserService userService;
    private final JwtTokenUtils jwtTokenUtils;
    private final AuthenticationManager authenticationManager;

    /**
     * Аутентификация пользователя
     *
     * @param authRequest данные пользователя
     * @return токен
     */
    public ResponseEntity<?> createAuthToken(@RequestBody JwtRequest authRequest) {
//        try {
//            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
//        } catch (BadCredentialsException e) {
//            return new ResponseEntity<>(new AppError(HttpStatus.UNAUTHORIZED.value(), "Неправильный логин или пароль"), HttpStatus.UNAUTHORIZED);
//        }
        UserDetails userDetails = userService.loadUserByUsername(authRequest.getUsername());
        String token = jwtTokenUtils.generateToken(userDetails);
//        String token1 ="eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImFkbWluIiwiaWF0IjoxNzUxMTg0MzU4LCJleHAiOjE3NTExODQ5NTh9.IEg27SY2w9jY0Rl8TTm6ZIMpfmYMhdrQdupXP9sYurY";
        return ResponseEntity.ok(new JwtResponse(token));
    }

}
