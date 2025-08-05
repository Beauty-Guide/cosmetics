package ru.cosmetic.server.requestDto;

import lombok.Data;
import ru.cosmetic.server.responseDto.CosmeticResponse;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CosmeticBagRequest {
    private String id;
    private String name;
    private Long ownerId;
    private LocalDateTime createdAt;
    private Integer likes;
    private List<CosmeticResponse> cosmetics;
    private Boolean hasCosmetic;
}
