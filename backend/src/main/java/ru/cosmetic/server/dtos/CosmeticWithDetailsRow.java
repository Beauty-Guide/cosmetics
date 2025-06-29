package ru.cosmetic.server.dtos;

import lombok.Data;

@Data
public class CosmeticWithDetailsRow {

    private Long cosmeticId;
    private String cosmeticName;
    private String cosmeticDescription;

    private Long actionId;
    private String actionName;

    private Long skinTypeId;
    private String skinTypeName;
}
