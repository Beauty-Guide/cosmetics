package ru.cosmetic.server.responseDto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CosmeticBagResponse {

    private String id;
    private String name;
    @JsonIgnore
    private Long ownerId;
    private LocalDateTime createdAt;
    private Integer likes;
    private List<CosmeticResponse> cosmetics;
    private Boolean hasCosmetic;
}
