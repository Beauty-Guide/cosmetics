package ru.cosmetic.server.requestDto;

import lombok.Builder;
import lombok.Data;
import ru.cosmetic.server.enums.ActionType;
import ru.cosmetic.server.models.Location;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AnalyticsRequest {
    private Long cosmeticId;
    private UUID cosmeticBagId;
    private ActionType action;
    private Location location;
    private String device;
    private List<Long> brandIds;
    private List<Long> actionIds;
    private List<Long> skinTypeIds;
    private String query;
    private Long marketPlaceId;
}