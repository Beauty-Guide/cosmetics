package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "cosmetic_action")
public class CosmeticAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

}
