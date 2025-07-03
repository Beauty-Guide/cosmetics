package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.CosmeticAction;
import ru.cosmetic.server.models.CosmeticImage;
import ru.cosmetic.server.repo.CosmeticImageRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CosmeticImageService {

    private final CosmeticImageRepo cosmeticImageRepo;

    public void save(CosmeticImage cosmeticAction) {
        cosmeticImageRepo.save(cosmeticAction);
    }

    public boolean remove(Long id) {
        if (!cosmeticImageRepo.existsById(id)) {
            return false;
        }
        cosmeticImageRepo.deleteById(id);
        return true;
    }

    public CosmeticImage findById(Long id) {
        return cosmeticImageRepo.findById(id).orElse(null);
    }

    public Integer getCountImageByCosmeticId(Long cosmeticId) {
        return cosmeticImageRepo.countByCosmetic_Id(cosmeticId);
    }


    public List<CosmeticImage> findAllById(List<Long> ids) {
        return cosmeticImageRepo.findAllById(ids);
    }

    public List<CosmeticImage> findAll() {
        return cosmeticImageRepo.findAll();
    }

}
