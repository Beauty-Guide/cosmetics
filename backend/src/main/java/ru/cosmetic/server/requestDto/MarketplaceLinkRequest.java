package ru.cosmetic.server.requestDto;

import lombok.Data;

@Data
public class MarketplaceLinkRequest {

    private String name;
    private String url;
    private String locale;

}
