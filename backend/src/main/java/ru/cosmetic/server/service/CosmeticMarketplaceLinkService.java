package ru.cosmetic.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticMarketplaceLink;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.repo.CosmeticMarketplaceLinkRepo;
import ru.cosmetic.server.requestDto.MarketplaceLinkRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CosmeticMarketplaceLinkService {

    private final CosmeticMarketplaceLinkRepo cosmeticMarketplaceLinkRepo;

    public void save(CosmeticMarketplaceLink cosmeticMarketplaceLink) {
        cosmeticMarketplaceLinkRepo.save(cosmeticMarketplaceLink);
    }

    public void create(MarketplaceLinkRequest request, Cosmetic cosmetic) {
        CosmeticMarketplaceLink cosmeticMarketplaceLink = CosmeticMarketplaceLink.builder()
                .id(request.getId())
                .marketplaceName(request.getName())
                .location(request.getLocale())
                .productLink(request.getUrl())
                .cosmetic(cosmetic)
                .user(new User(request.getSellerId()))
                .isDeleted(false)
                .build();
        save(cosmeticMarketplaceLink);
    }

    public void delete(CosmeticMarketplaceLink cosmeticMarketplaceLink) {
        cosmeticMarketplaceLink.setIsDeleted(true);
        cosmeticMarketplaceLinkRepo.save(cosmeticMarketplaceLink);
    }

    @Transactional
    public void deleteAllByCosmeticId(Cosmetic cosmetic) {
        cosmeticMarketplaceLinkRepo.deleteAllByCosmetic(cosmetic);
    }

    public List<CosmeticMarketplaceLink> findAllByCosmeticId(Long id) {
        return cosmeticMarketplaceLinkRepo.findAllByCosmeticId(id);
    }

    public CosmeticMarketplaceLink findById(Long id) {
        return cosmeticMarketplaceLinkRepo.findById(id).orElse(null)    ;
    }
}
