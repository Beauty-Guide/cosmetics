package ru.cosmetic.server.models;

import lombok.Data;

import jakarta.persistence.*;

import java.util.Collection;

/**
 * Пользователь
 */
@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", unique = true, nullable = true)
    private String username; // Может быть null для OAuth2-пользователей

    @Column(name = "password", nullable = true)
    private String password; // Может быть null для OAuth2-пользователей

    @Column(name = "email", unique = true, nullable = false)
    private String email; // Обязательное поле для всех пользователей

    @Column(name = "oauth2_id")
    private String oauth2Id; // ID от Google, GitHub и т.д.

    @Column(name = "provider")
    private String provider; // Значения: "local", "google", "github" и т.д.

    @ManyToMany
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Collection<Role> roles;

    public User(Long id) {
        this.id = id;
    }

    public User() {

    }
}
