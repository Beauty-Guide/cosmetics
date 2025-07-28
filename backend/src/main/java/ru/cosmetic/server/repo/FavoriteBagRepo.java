package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.CosmeticBag;
import ru.cosmetic.server.models.FavoriteBag;

import java.util.List;
import java.util.UUID;

@Repository
public interface FavoriteBagRepo extends JpaRepository<FavoriteBag, UUID> {
    boolean existsByUserIdAndBagId(Long userId, UUID bagId);

    @Query("SELECT fb.bag FROM FavoriteBag fb JOIN FETCH fb.bag.bagItems WHERE fb.user.id = :userId")
    List<CosmeticBag> findAllLikedBagsByUser(@Param("userId") Long userId);

    void deleteByUserIdAndBagId(Long userId, UUID bagId);
}