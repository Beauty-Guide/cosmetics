package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Роль
 */
@Entity
@Data
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;
}