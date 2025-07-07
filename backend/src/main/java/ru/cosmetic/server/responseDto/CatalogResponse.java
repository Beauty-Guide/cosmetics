package ru.cosmetic.server.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
public class CatalogResponse {
    private Long id;
    private String name;
    private Boolean hasChildren;

    public CatalogResponse() {
    }

    public CatalogResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
