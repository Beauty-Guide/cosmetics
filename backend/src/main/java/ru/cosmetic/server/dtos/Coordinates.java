package ru.cosmetic.server.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Coordinates {

    private double lat;
    private double lng;

}
