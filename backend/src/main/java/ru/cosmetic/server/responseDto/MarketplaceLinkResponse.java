package ru.cosmetic.server.responseDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MarketplaceLinkResponse {

    private Long id;
    private String name;
    private String url;
    private String locale;

}
