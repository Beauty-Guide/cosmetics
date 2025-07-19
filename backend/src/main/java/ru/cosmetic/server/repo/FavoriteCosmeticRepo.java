package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.FavoriteCosmetic;
import ru.cosmetic.server.models.User;

import java.util.List;

@Repository
public interface FavoriteCosmeticRepo extends JpaRepository<FavoriteCosmetic, Long> {
    List<FavoriteCosmetic> findByUser(User user);
    FavoriteCosmetic findByUserAndCosmetic(User user, Cosmetic cosmetic);

    void deleteByCosmeticId(Long id);
}