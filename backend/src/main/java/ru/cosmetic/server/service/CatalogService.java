package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Catalog;
import ru.cosmetic.server.repo.CatalogRepo;
import ru.cosmetic.server.requestDto.CatalogRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CatalogRepo catalogRepo;
    private final JdbcTemplate jdbcTemplate;

    public void save(CatalogRequest catalogDto) {
        Catalog catalog = new Catalog();
        catalog.setName(catalogDto.getName());

        if (catalogDto.getParentId() != null) {
            Catalog parent = catalogRepo.findById(catalogDto.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Родительский каталог не найден"));
            catalog.setParent(parent);
        }

        catalogRepo.save(catalog);
    }

    public void update(Catalog catalog) {
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

    public List<Catalog> getAllCatalogsForAddCosmetic() {
        String sql = """
        SELECT c.id, c.name
        FROM catalog c
        LEFT JOIN catalog child ON c.id = child.parent_id
        WHERE child.id IS NULL
    """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Catalog(
                        rs.getLong("id"),
                        rs.getString("name")
                ));
    }
}
