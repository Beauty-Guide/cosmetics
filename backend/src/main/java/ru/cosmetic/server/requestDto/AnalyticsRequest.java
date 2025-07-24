package ru.cosmetic.server.requestDto;

import lombok.Builder;
import lombok.Data;
import ru.cosmetic.server.enums.ActionType;

import java.util.List;

@Data
@Builder
public class AnalyticsRequest {
    private Long cosmeticId;
    private ActionType action;
    private String location;
    private String device;
    private List<Long> brandIds;
    private List<Long> actionIds;
    private List<Long> skinTypeIds;
    private String query;
    private Long marketPlaceId;
}