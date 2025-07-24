package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ru.cosmetic.server.enums.ActionType;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cosmetic_analytics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CosmeticAnalytic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cosmetic_id", nullable = false)
    private Cosmetic cosmetic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActionType action;

    @Column(length = 100)
    private String location; // страна или "RU-Moscow"

    @Column(length = 50)
    private String device;   // mobile / desktop / tablet

    @ElementCollection
    @CollectionTable(name = "analytics_action_ids", joinColumns = @JoinColumn(name = "analytics_id"))
    @Column(name = "action_id")
    private List<Long> actionIds;

    @ElementCollection
    @CollectionTable(name = "analytics_skin_type_ids", joinColumns = @JoinColumn(name = "analytics_id"))
    @Column(name = "skin_type_id")
    private List<Long> skinTypeIds;

    @ElementCollection
    @CollectionTable(name = "analytics_brand_ids", joinColumns = @JoinColumn(name = "analytics_id"))
    @Column(name = "brand_id")
    private List<Long> brandIds;

    @Column(columnDefinition = "TEXT")
    private String query; // текст из поиска/фильтра

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marketplace_link_id")
    private CosmeticMarketplaceLink marketplaceLink;
}