package ru.cosmetic.server.dtos;

import lombok.Builder;
import lombok.Data;

@Data
public class LocationData {
    private Long locationId;
    private Long cityId;
    private Long countryId;
    private String cityRu;
    private String cityEn;
    private String countryRu;
    private String countryEn;
    private String regionRu;
    private String regionEn;
    private Coordinates coordinates;
    private String source; // "geolocation" или "ip"
    private Long timestamp;

    public LocationData() {
        this.timestamp = System.currentTimeMillis();
    }
}