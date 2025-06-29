package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.CosmeticAction;
import ru.cosmetic.server.repo.CosmeticActionRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CosmeticActionService {

    private final CosmeticActionRepo cosmeticActionRepo;

    public void save(CosmeticAction cosmeticAction) {
        cosmeticActionRepo.save(cosmeticAction);
    }

    public boolean remove(Long id) {
        if (!cosmeticActionRepo.existsById(id)) {
            return false;
        }
        cosmeticActionRepo.deleteById(id);
        return true;
    }

    public CosmeticAction findById(Long id) {
        return cosmeticActionRepo.findById(id).get();
    }

    public List<CosmeticAction> findAll() {
        return cosmeticActionRepo.findAll();
    }
}
