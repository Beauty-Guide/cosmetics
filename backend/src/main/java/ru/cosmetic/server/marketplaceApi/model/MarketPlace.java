package ru.cosmetic.server.marketplaceApi.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "market_places")
public class MarketPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;
}
