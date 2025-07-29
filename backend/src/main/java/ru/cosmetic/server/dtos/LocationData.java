package ru.cosmetic.server.dtos;

import lombok.Builder;
import lombok.Data;

@Data
public class LocationData {

    private String city;
    private String country;
    private String region;
    private Coordinates coordinates;
    private String source; // "geolocation" или "ip"
    private Long timestamp;

    public LocationData() {
    }
}
