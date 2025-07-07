package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.Brand;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticImage;

import java.util.List;
import java.util.UUID;

@Repository
public interface CosmeticImageRepo extends JpaRepository<CosmeticImage, UUID> {
    Integer countByCosmetic_Id(Long cosmeticId);

    List<CosmeticImage> findByCosmetic(Cosmetic cosmetic);

    void deleteByCosmetic(Cosmetic cosmetic);

    void deleteByCosmeticId(Long id);
}
