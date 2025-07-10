package ru.cosmetic.server.configs;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import ru.cosmetic.server.auth.OAuthUserDetails;
import ru.cosmetic.server.utils.JwtTokenUtils;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenUtils jwtTokenUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String token = jwtTokenUtils.generateToken(new OAuthUserDetails(authentication));
        response.addHeader("Authorization", "Bearer " + token);
        response.sendRedirect("http://localhost:3000/auth/callback?token=" + token); // замени на свой URL фронтенда
    }
}