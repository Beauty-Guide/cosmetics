package ru.cosmetic.server.requestDto;

import lombok.Data;

@Data
public class CatalogRequest {
    private Long id;
    private String name;
    private Long parentId;
}