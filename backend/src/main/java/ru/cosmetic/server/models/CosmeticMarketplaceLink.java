package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "cosmetic_marketplace_link")
@Data
@Builder
@AllArgsConstructor
public class CosmeticMarketplaceLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location")
    private String location;

    @Column(name = "marketplace_name")
    private String marketplaceName; // например: "Ozon", "Wildberries"

    @Column(name = "product_link")
    private String productLink;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "cosmetic_id")
    private Cosmetic cosmetic;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public CosmeticMarketplaceLink() {

    }

    public CosmeticMarketplaceLink(Long id) {
        this.id = id;
    }
}