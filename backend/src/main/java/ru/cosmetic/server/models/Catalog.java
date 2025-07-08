package ru.cosmetic.server.models;

import jakarta.persistence.*;
import lombok.Data;

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

    @Column(name = "name_en")
    private String nameEN;

    @Column(name = "name_kr")
    private String nameKR;


    // Родительский каталог (для иерархии)
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Catalog parent;

    public Catalog() {
    }

    public Catalog(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}