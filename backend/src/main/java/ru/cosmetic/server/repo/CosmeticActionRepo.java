package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.cosmetic.server.models.CosmeticAction;

public interface CosmeticActionRepo extends JpaRepository<CosmeticAction, Long> {
}
