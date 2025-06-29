package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "cosmetic")
public class Cosmetic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    // Связь с изображениями
    @OneToMany(mappedBy = "cosmetic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CosmeticImage> images;

    // Связь с брендом
    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    // Ключевые ингредиенты
    @ManyToMany
    @JoinTable(
            name = "cosmetic_key_ingredient",
            joinColumns = @JoinColumn(name = "cosmetic_id"),
            inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    private List<KeyIngredient> keyIngredients;

    @ManyToOne
    @JoinColumn(name = "catalog_id")
    private Catalog catalog;

    // Совместимость
    @Column(name = "compatibility")
    private String compatibility;

    // Рекомендации по применению
    @Column(name = "usage_recommendations")
    private String usageRecommendations;

    // Способ применения
    @Column(name = "application_method")
    private String applicationMethod;

    @ManyToMany
    @JoinTable(
            name = "cosmetic_cosmetic_action",
            joinColumns = @JoinColumn(name = "cosmetic_id"),
            inverseJoinColumns = @JoinColumn(name = "action_id")
    )
    private List<CosmeticAction> actions;

    // Множество типов кожи (например: жирная, сухая)
    @ManyToMany
    @JoinTable(
            name = "cosmetic_skin_type",
            joinColumns = @JoinColumn(name = "cosmetic_id"),
            inverseJoinColumns = @JoinColumn(name = "skin_type_id")
    )
    private List<SkinType> skinTypes;

    public Cosmetic() {
    }

    public Cosmetic(long id, String name) {
    }
}
