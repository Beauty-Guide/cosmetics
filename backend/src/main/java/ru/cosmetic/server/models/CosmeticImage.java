package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
@Table(name = "cosmetic_image")
public class CosmeticImage {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, columnDefinition = "UUID")
    private UUID id;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "is_main", nullable = false)
    private boolean isMain = false;

    @ManyToOne
    @JoinColumn(name = "cosmetic_id", nullable = false)
    private Cosmetic cosmetic;
}