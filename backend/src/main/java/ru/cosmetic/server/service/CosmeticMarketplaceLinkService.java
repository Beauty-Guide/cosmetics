package ru.cosmetic.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticMarketplaceLink;
import ru.cosmetic.server.repo.CosmeticMarketplaceLinkRepo;

@Service
@RequiredArgsConstructor
public class CosmeticMarketplaceLinkService {

    private final CosmeticMarketplaceLinkRepo cosmeticMarketplaceLinkRepo;

    public void save(CosmeticMarketplaceLink cosmeticMarketplaceLink) {
        cosmeticMarketplaceLinkRepo.save(cosmeticMarketplaceLink);
    }

    @Transactional
    public void deleteAllByCosmeticId(Cosmetic cosmetic) {
        cosmeticMarketplaceLinkRepo.deleteAllByCosmetic(cosmetic);
    }
}
