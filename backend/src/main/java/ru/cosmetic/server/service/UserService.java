package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.cosmetic.server.dtos.UserDto;
import ru.cosmetic.server.models.*;
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
               r.id AS role_id, r.name AS role_name,
               l.id AS location_id,
               c.id AS city_id, c.name_ru AS city_name_ru, c.name_en AS city_name_en,
               co.id AS country_id, co.name_ru AS country_name_ru, co.name_en AS country_name_en
        FROM users u
        LEFT JOIN users_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        LEFT JOIN locations l ON u.location_id = l.id
        LEFT JOIN cities c ON l.city_id = c.id
        LEFT JOIN countries co ON l.country_id = co.id
        WHERE u.email = ?
        """;

        return jdbcTemplate.query(sql, rs -> {
            User user = null;
            List<Role> roles = new ArrayList<>();
            Location location = null;
            City city = null;
            Country country = null;

            while (rs.next()) {
                if (user == null) {
                    user = new User();
                    user.setId(rs.getObject("user_id", Long.class));
                    user.setUsername(rs.getObject("username", String.class));
                    user.setPassword(rs.getObject("password", String.class));
                    user.setEmail(rs.getString("email"));
                    user.setOauth2Id(rs.getObject("oauth2_id", String.class));
                    user.setProvider(rs.getObject("provider", String.class));

                    // Создаем локацию, если есть данные
                    Long locationId = rs.getObject("location_id", Long.class);
                    if (locationId != null) {
                        // Создаем страну
                        Long countryId = rs.getObject("country_id", Long.class);
                        if (countryId != null) {
                            country = Country.builder()
                                    .id(countryId)
                                    .nameRU(rs.getString("country_name_ru"))
                                    .nameEN(rs.getString("country_name_en"))
                                    .build();
                        }

                        // Создаем город
                        Long cityId = rs.getObject("city_id", Long.class);
                        if (cityId != null) {
                            city = City.builder()
                                    .id(cityId)
                                    .nameRU(rs.getString("city_name_ru"))
                                    .nameEN(rs.getString("city_name_en"))
                                    .country(country)
                                    .build();
                        }

                        location = Location.builder()
                                .id(locationId)
                                .city(city)
                                .country(country)
                                .build();
                        user.setLocation(location);
                    }
                }

                Integer roleId = rs.getObject("role_id", Integer.class);
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

    public void update(User user) {
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    private final RowMapper<UserDto> userRowMapper = (rs, rowNum) ->
            UserDto.builder()
                    .id(rs.getLong("id"))
                    .username(rs.getString("username"))
                    .email(rs.getString("email"))
                    .build();

    /**
     * Возвращает всех пользователей, у которых есть указанная роль.
     *
     * @param roleName имя роли, например "ROLE_ADMIN"
     * @return список DTO пользователей
     */
    public List<UserDto> findAllByRole(String roleName) {
        String sql = """
            SELECT u.id, u.username, u.email
            FROM users u
            JOIN users_roles ur ON u.id = ur.user_id
            JOIN roles r        ON r.id = ur.role_id
            WHERE r.name = ?
            ORDER BY u.id
        """;
        return jdbcTemplate.query(sql, userRowMapper, roleName);
    }
}
