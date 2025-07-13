package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.marketplaceApi.model.SellerCredential;

@Repository
public interface SellerCredentialRepo extends JpaRepository<SellerCredential, Long> {

    SellerCredential findByUserIdAndMarketplaceId(String userId, String marketplaceId);
}
