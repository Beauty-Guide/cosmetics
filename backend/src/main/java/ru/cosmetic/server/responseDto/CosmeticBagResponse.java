package ru.cosmetic.server.responseDto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CosmeticBagResponse {

    private UUID id;
    private String name;
    private Long ownerId;
    private Long createrId;
    private LocalDateTime createdAt;
    private Integer likes;
    private List<CosmeticResponse> cosmetics;
}
