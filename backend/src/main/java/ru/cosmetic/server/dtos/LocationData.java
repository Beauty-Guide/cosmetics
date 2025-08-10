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

    @Override
    public String toString() {
        return "LocationData{" +
                "locationId=" + locationId +
                ", cityId=" + cityId +
                ", countryId=" + countryId +
                ", cityRu='" + cityRu + '\'' +
                ", cityEn='" + cityEn + '\'' +
                ", countryRu='" + countryRu + '\'' +
                ", countryEn='" + countryEn + '\'' +
                ", regionRu='" + regionRu + '\'' +
                ", regionEn='" + regionEn + '\'' +
                ", coordinates=" + coordinates +
                ", source='" + source + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}