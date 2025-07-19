package ru.cosmetic.server.models;

import lombok.Data;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * История поисковых запросов пользователя
 */
@Entity
@Data
@Table(name = "user_search_history")
public class UserSearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Связь с пользователем
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Введённая строка поиска
    @Column(name = "search_query", nullable = false, columnDefinition = "TEXT")
    private String searchQuery;

    // Дата и время поиска
    @Column(name = "searched_at", nullable = false)
    private LocalDateTime searchedAt = LocalDateTime.now();

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;
}