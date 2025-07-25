package ru.cosmetic.server.requestDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CosmeticBagRequest {
    private String name;
}
