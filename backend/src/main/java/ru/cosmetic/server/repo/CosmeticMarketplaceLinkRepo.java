package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticMarketplaceLink;

@Repository
public interface CosmeticMarketplaceLinkRepo extends JpaRepository<CosmeticMarketplaceLink, Long> {
    void deleteAllByCosmetic(Cosmetic cosmetic);
    void deleteAllByCosmeticId(Long id);
}
