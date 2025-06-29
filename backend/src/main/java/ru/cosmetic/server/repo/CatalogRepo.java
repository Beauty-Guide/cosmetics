package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.Catalog;

@Repository
public interface CatalogRepo extends JpaRepository<Catalog, Long> {
}
