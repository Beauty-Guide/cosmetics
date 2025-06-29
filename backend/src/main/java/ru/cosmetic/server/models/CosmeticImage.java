package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "cosmetic_image")
public class CosmeticImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "url", nullable = false)
    private String url;

    @ManyToOne
    @JoinColumn(name = "cosmetic_id", nullable = false)
    private Cosmetic cosmetic;
}