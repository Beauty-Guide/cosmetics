package ru.cosmetic.server.requestDto;

import lombok.Data;

@Data
public class MarketplaceLinkRequest {

    private Long id;
    private String name;
    private String url;
    private String locale;
    private Long sellerId;

}
