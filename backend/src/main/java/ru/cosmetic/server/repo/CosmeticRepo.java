package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticAction;
import ru.cosmetic.server.models.SkinType;

import java.util.List;

@Repository
public interface CosmeticRepo extends JpaRepository<Cosmetic, Long> {
    List<Cosmetic> findAllBySkinTypesIn(List<SkinType> skinTypes);

    List<Cosmetic> findAllByActionsIn(List<CosmeticAction> actions);
}
