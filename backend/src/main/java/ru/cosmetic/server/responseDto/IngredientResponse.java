package ru.cosmetic.server.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class IngredientResponse {
    private Long id;
    private String name;
}
