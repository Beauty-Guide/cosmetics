package ru.cosmetic.server.requestDto;

import lombok.Data;

import java.util.List;

@Data
public  class CosmeticIdsRequest {
    private List<Long> cosmeticIds;

    public void setCosmeticIds(List<Long> cosmeticIds) {
        this.cosmeticIds = cosmeticIds;
    }
}