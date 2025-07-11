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
    private final JwtTokenUtils jwtUtils;
    private final RoleService roleService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String email = ((OAuth2User) authentication.getPrincipal()).getAttribute("email");
        String name = ((OAuth2User) authentication.getPrincipal()).getAttribute("name");

        if (userService.findByEmail(email) == null) {
            User user = new User();
            user.setUsername(name);
            user.setEmail(email);
            user.setRoles(Collections.singleton(roleService.getUserRole())); // или любая логика
            userRepository.save(user);
        }
        String token = jwtUtils.generateToken(email);

        response.sendRedirect("http://localhost:3000/login-success?token=" + token);
    }
}