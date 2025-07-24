package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.CosmeticAnalytic;

@Repository
public interface AnalyticsRepo extends JpaRepository<CosmeticAnalytic, Long> {
}
