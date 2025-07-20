package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.cosmetic.server.models.Role;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.repo.UserRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleService roleService;
    private final JdbcTemplate jdbcTemplate;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findByEmail(String email) {
        String sql = """
        SELECT u.id AS user_id, u.username, u.password, u.email, u.oauth2_id, u.provider,
               r.id AS role_id, r.name AS role_name
        FROM users u
        LEFT JOIN users_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.email = ?
    """;

        return jdbcTemplate.query(sql, rs -> {
            User user = null;
            List<Role> roles = new ArrayList<>();

            while (rs.next()) {
                if (user == null) {
                    user = new User();
                    user.setId(rs.getObject("user_id", Long.class)); // <-- здесь
                    user.setUsername(rs.getObject("username", String.class));
                    user.setPassword(rs.getObject("password", String.class));
                    user.setEmail(rs.getString("email"));
                    user.setOauth2Id(rs.getObject("oauth2_id", String.class));
                    user.setProvider(rs.getObject("provider", String.class));
                }

                Integer roleId = rs.getObject("role_id", Integer.class); // <-- и здесь
                if (roleId != null) {
                    Role role = new Role();
                    role.setId(Long.valueOf(roleId));
                    role.setName(rs.getString("role_name"));
                    roles.add(role);
                }
            }

            if (user != null) {
                user.setRoles(roles);
            }

            return user;
        }, email);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }


    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByEmail(username);
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList())
        );
    }

    public boolean createUser(User user) {
        String username = user.getUsername();
        User findUser = findByEmail(username);
        if (findUser == null) {
            if (user.getUsername().equals("admin")) {
                user.setRoles(Collections.singleton(roleService.getAdminRole()));
            } else {
                user.setRoles(Collections.singleton(roleService.getUserRole()));
            }
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
