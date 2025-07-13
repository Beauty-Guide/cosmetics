package ru.cosmetic.server.marketplaceApi.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "seller_credentials")
public class SellerCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "marketplace_id", nullable = false)
    private String marketplaceId;

    @Column(name = "client_id", nullable = false)
    private String clientId;

    @Column(name = "api_key", nullable = false)
    private String apiKey; // зашифрованное значение

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters and setters
}