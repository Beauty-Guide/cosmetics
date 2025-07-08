package ru.cosmetic.server.requestDto;

import lombok.Data;

@Data
public class CatalogRequest {
    private Long id;
    private String name;
    private String nameEN;
    private String nameKR;
    private Long parentId;
}