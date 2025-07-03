package ru.cosmetic.server.dtos;

import lombok.Data;

@Data
public class CatalogDto {
    private Long id;
    private String name;
    private Long parentId;
}