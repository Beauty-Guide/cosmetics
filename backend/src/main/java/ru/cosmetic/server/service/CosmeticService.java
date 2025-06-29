package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticAction;
import ru.cosmetic.server.models.SkinType;
import ru.cosmetic.server.repo.CosmeticRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CosmeticService {

    private final CosmeticRepo cosmeticRepo;

    public void save(Cosmetic cosmetic) {
        cosmeticRepo.save(cosmetic);
    }

    public List<Cosmetic> getAllCosmetics() {
        return cosmeticRepo.findAll();
    }

    public List<Cosmetic> getCosmeticsBySkinTypes(List<SkinType> skinTypes) {
        return cosmeticRepo.findAllBySkinTypesIn(skinTypes);
    }

    public List<Cosmetic> getCosmeticsByActions(List<CosmeticAction> actions) {
        return cosmeticRepo.findAllByActionsIn(actions);
    }
}
