package ru.cosmetic.server.marketplaceApi.ozon;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;


@FeignClient(name = "OzonProductPriceClient", url = " https://api-seller.ozon.ru ")
public interface OzonProductPriceClient {

    @PostMapping("/v5/product/info/prices")
    OzonProductPriceResponse getProductPrice(
            @RequestHeader("Client-Id") String clientId,
            @RequestHeader("Api-Key") String apiKey,
            @RequestBody OzonProductPriceRequest request
    );
}