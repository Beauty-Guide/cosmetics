package ru.cosmetic.server.responseDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CosmeticBagWithOwnerStatusResponse {

    private CosmeticBagResponse cosmeticBag;
    private boolean isOwner;

}
