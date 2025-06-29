package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.cosmetic.server.models.SkinType;

public interface SkinTypeRepo extends JpaRepository<SkinType, Long> {
}
