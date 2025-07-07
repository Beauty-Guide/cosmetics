package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticImage;
import ru.cosmetic.server.repo.CosmeticImageRepo;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CosmeticImageService {

    private final CosmeticImageRepo cosmeticImageRepo;

    public CosmeticImage save(CosmeticImage cosmeticAction) {
        return cosmeticImageRepo.save(cosmeticAction);
    }

    public boolean remove(UUID id) {
        if (!cosmeticImageRepo.existsById(id)) {
            return false;
        }
        cosmeticImageRepo.deleteById(id);
        return true;
    }

    public boolean remove(Cosmetic cosmetic) {
        cosmeticImageRepo.deleteByCosmetic(cosmetic);
        return true;
    }

    public CosmeticImage findById(UUID id) {
        return cosmeticImageRepo.findById(id).orElse(null);
    }

    public Integer getCountImageByCosmeticId(Long cosmeticId) {
        return cosmeticImageRepo.countByCosmetic_Id(cosmeticId);
    }


    public List<CosmeticImage> findAllById(List<UUID> ids) {
        return cosmeticImageRepo.findAllById(ids);
    }

    public List<CosmeticImage> findAllByCosmetic(Cosmetic cosmetic) {
        return cosmeticImageRepo.findByCosmetic(cosmetic);
    }

    public List<CosmeticImage> findAll() {
        return cosmeticImageRepo.findAll();
    }

}
