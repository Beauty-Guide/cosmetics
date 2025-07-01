package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.SkinType;
import ru.cosmetic.server.repo.SkinTypeRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkinTypeService {

    private final SkinTypeRepo skinTypeRepo;

    public void save(SkinType skinType) {
        skinTypeRepo.save(skinType);
    }

    public boolean remove(Long id) {
        if (!skinTypeRepo.existsById(id)) {
            return false;
        }
        skinTypeRepo.deleteById(id);
        return true;
    }

    public SkinType findById(Long id) {
        return skinTypeRepo.findById(id).orElse(null);
    }

    public List<SkinType> findAllById(List<Long> skinTypeIds) {
        return skinTypeRepo.findAllById(skinTypeIds);
    }

    public List<SkinType> findAll() {
        return skinTypeRepo.findAll();
    }

}
