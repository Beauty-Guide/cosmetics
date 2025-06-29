package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Brand;
import ru.cosmetic.server.repo.BrandRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepo brandRepo;

    public void save(Brand brand) {
        brandRepo.save(brand);
    }

    public boolean remove(Long id) {
        if (!brandRepo.existsById(id)) {
            return false;
        }
        brandRepo.deleteById(id);
        return true;
    }

    public Brand findById(Long id) {
        return brandRepo.findById(id).orElse(null);
    }

    public List<Brand> findAll() {
        return brandRepo.findAll();
    }
}
