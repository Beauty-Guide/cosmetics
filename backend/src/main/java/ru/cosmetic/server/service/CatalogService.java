package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.dtos.CatalogDto;
import ru.cosmetic.server.models.Brand;
import ru.cosmetic.server.models.Catalog;
import ru.cosmetic.server.repo.CatalogRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CatalogRepo catalogRepo;

    public void save(CatalogDto catalogDto) {
        Catalog catalog = new Catalog();
        catalog.setName(catalogDto.getName());

        if (catalogDto.getParentId() != null) {
            Catalog parent = catalogRepo.findById(catalogDto.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Родительский каталог не найден"));
            catalog.setParent(parent);
        }

        catalogRepo.save(catalog);
    }

    public boolean remove(Long id) {
        if (!catalogRepo.existsById(id)) {
            return false;
        }
        catalogRepo.deleteById(id);
        return true;
    }

    public Catalog findById(Long id) {
        return catalogRepo.findById(id).orElse(null);
    }

    public List<Catalog> findAll() {
        return catalogRepo.findAll();
    }
}
