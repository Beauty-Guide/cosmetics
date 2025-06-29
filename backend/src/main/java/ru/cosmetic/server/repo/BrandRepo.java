package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.Brand;

@Repository
public interface BrandRepo extends JpaRepository<Brand, Long> {
}
