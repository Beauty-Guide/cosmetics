package ru.cosmetic.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.cosmetic.server.models.CosmeticBag;
import ru.cosmetic.server.models.FavoriteBag;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.repo.CosmeticBagRepo;
import ru.cosmetic.server.repo.FavoriteBagRepo;
import ru.cosmetic.server.responseDto.CosmeticBagResponse;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavoriteBagService {

    private final FavoriteBagRepo favoriteRepo;
    private final CosmeticBagRepo bagRepo;
    private final UserService userService;

    @Transactional
    public void likeBag(UUID bagId, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        if (!favoriteRepo.existsByUserIdAndBagId(user.getId(), bagId)) {
            CosmeticBag bag = bagRepo.findById(bagId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            bag.setLikes(bag.getLikes() + 1);
            bagRepo.save(bag);

            FavoriteBag fb = FavoriteBag.builder()
                    .user(user)
                    .bag(bag)
                    .likedAt(LocalDateTime.now())
                    .build();
            favoriteRepo.save(fb);
        }
    }

    @Transactional
    public void unlikeBag(UUID bagId, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        favoriteRepo.deleteByUserIdAndBagId(user.getId(), bagId);

        CosmeticBag bag = bagRepo.findById(bagId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        bag.setLikes(Math.max(0, bag.getLikes() - 1));
        bagRepo.save(bag);
    }

    public List<CosmeticBagResponse> listLikedBags(Principal principal) {
        User user = userService.findByEmail(principal.getName());
        return favoriteRepo.findAllLikedBagsByUser(user.getId())
                .stream()
                .map(bag -> CosmeticBagResponse.builder()
                        .id("cosmeticBag_" + bag.getId())
                        .name(bag.getName())
                        .likes(bag.getLikes())
                        .build()
                ).toList();
    }
}