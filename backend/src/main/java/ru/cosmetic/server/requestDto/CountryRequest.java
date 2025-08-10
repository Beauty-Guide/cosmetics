package ru.cosmetic.server.requestDto;

import lombok.Data;

import java.util.List;

@Data
public class CountryRequest {
    Long id;
    String name;
    List<CityRequest> cities;
}
