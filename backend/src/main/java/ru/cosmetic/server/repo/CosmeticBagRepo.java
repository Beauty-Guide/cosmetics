package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.CosmeticBag;

import java.util.UUID;

@Repository
public interface CosmeticBagRepo extends JpaRepository<CosmeticBag, UUID> {

}
