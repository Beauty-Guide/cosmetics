package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.*;
import ru.cosmetic.server.models.Cosmetic;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cosmetic_bag")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CosmeticBag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "likes", nullable = false)
    private Integer likes = 0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "cosmetic_bag_item", joinColumns = @JoinColumn(name = "bag_id"), inverseJoinColumns = @JoinColumn(name = "cosmetic_id"))
    private List<Cosmetic> bagItems;
}