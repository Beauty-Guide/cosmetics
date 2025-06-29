package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "catalog")
public class Catalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    // Родительский каталог (для иерархии)
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Catalog parent;

//    // Дочерние каталоги
//    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Catalog> children;

    // Связь с косметикой
    @OneToMany(mappedBy = "catalog", cascade = CascadeType.ALL)
    private List<Cosmetic> cosmetics;
}