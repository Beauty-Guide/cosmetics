package ru.cosmetic.server.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.repo.UserRepository;
import ru.cosmetic.server.service.RoleService;
import ru.cosmetic.server.service.UserService;
import ru.cosmetic.server.utils.JwtTokenUtils;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtTokenUtils jwtTokenUtils;
    private final RoleService roleService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        if (email == null || email.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Email not found from OAuth2 provider");
            return;
        }
        if (userService.findByEmail(email) == null) {
            User user = new User();
            user.setUsername(name);
            user.setEmail(email);
            user.setRoles(Collections.singleton(roleService.getUserRole()));
            userRepository.save(user);
        }
        String accessToken = jwtTokenUtils.generateAccessToken(email);
        String refreshToken = jwtTokenUtils.generateRefreshToken(email);
        jwtTokenUtils.sendRefreshToken(refreshToken, response);
        response.sendRedirect("http://localhost:3000/login-success?token=" + accessToken);
    }
}