package ru.cosmetic.server.marketplaceApi.ozon;

import lombok.Data;

@Data
public class OzonProductPriceResponse {
    private String barcode;
    private String offer_id;
    private String price;
}