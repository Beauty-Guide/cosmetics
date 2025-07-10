package ru.cosmetic.server.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
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

    // Совместимость
    @Column(name = "compatibility")
    private String compatibility;
    @Column(name = "compatibility_en")
    private String compatibilityEN;
    @Column(name = "compatibility_kr")
    private String compatibilityKR;

    // Рекомендации по применению
    @Column(name = "usage_recommendations")
    private String usageRecommendations;
    @Column(name = "usage_recommendations_en")
    private String usageRecommendationsEN;
    @Column(name = "usage_recommendations_kr")
    private String usageRecommendationsKR;

    // Способ применения
    @Column(name = "application_method")
    private String applicationMethod;
    @Column(name = "application_method_en")
    private String applicationMethodEN;
    @Column(name = "application_method_kr")
    private String applicationMethodKR;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "rating")
    private Integer rating;

    @ManyToOne
    @JoinColumn(name = "catalog_id")
    private Catalog catalog;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToMany
    @JoinTable(name = "cosmetic_cosmetic_action", joinColumns = @JoinColumn(name = "cosmetic_id"), inverseJoinColumns = @JoinColumn(name = "action_id"))
    private List<CosmeticAction> actions;

    @ManyToMany
    @JoinTable(name = "cosmetic_skin_type", joinColumns = @JoinColumn(name = "cosmetic_id"), inverseJoinColumns = @JoinColumn(name = "skin_type_id"))
    private List<SkinType> skinTypes;

    @ManyToMany
    @JoinTable(name = "cosmetic_ingredient", joinColumns = @JoinColumn(name = "cosmetic_id"), inverseJoinColumns = @JoinColumn(name = "ingredient_id"))
    private List<Ingredient> ingredients;

}
