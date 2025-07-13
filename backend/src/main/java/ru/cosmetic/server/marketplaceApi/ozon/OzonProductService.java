package ru.cosmetic.server.marketplaceApi.ozon;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import ru.cosmetic.server.marketplaceApi.model.SellerCredential;

@Service
@RequiredArgsConstructor
public class OzonProductService {

    private final OzonProductPriceClient ozonProductPriceClient;

    public OzonProductPriceResponse fetchProductPrice(SellerCredential credential, Long productId) {
        OzonProductPriceRequest request = new OzonProductPriceRequest();
        request.setProduct_id(productId);

        return ozonProductPriceClient.getProductPrice(
                credential.getClientId(),
                credential.getApiKey(),
                request
        );
    }
}