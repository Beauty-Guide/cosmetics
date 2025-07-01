package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.Brand;
import ru.cosmetic.server.models.CosmeticImage;

@Repository
public interface CosmeticImageRepo extends JpaRepository<CosmeticImage, Long> {
}
