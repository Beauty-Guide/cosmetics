package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Catalog;
import ru.cosmetic.server.repo.CatalogRepo;
import ru.cosmetic.server.requestDto.CatalogRequest;
import ru.cosmetic.server.responseDto.CatalogResponse;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CatalogRepo catalogRepo;
    private final JdbcTemplate jdbcTemplate;

    public void save(CatalogRequest catalogDto) {
        Catalog catalog = new Catalog();
        catalog.setName(catalogDto.getName());
        catalog.setNameEN(catalogDto.getNameEN());
        catalog.setNameKR(catalogDto.getNameKR());

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

    public List<CatalogResponse> findAll(String lang) {
        List<Catalog> catalogs = catalogRepo.findAll();
        Map<Long, CatalogResponse> responseMap = new HashMap<>();

        // Сначала создаем все CatalogResponse с пустым parent
        for (Catalog catalog : catalogs) {
            CatalogResponse response = new CatalogResponse();
            response.setId(catalog.getId());
            response.setName(getNameByLang(catalog, lang));
            response.setHasChildren(false); // пока не знаем
            response.setParent(null);
            responseMap.put(catalog.getId(), response);
        }

        // Теперь устанавливаем родителей
        for (Catalog catalog : catalogs) {
            CatalogResponse current = responseMap.get(catalog.getId());
            Catalog parent = catalog.getParent();

            if (parent != null && responseMap.containsKey(parent.getId())) {
                CatalogResponse parentResponse = responseMap.get(parent.getId());
                current.setParent(parentResponse);
                parentResponse.setHasChildren(true); // указываем, что у родителя есть дети
            }
        }

        return new ArrayList<>(responseMap.values());
    }

    // Получает имя по языку
    private String getNameByLang(Catalog catalog, String lang) {
        if ("en".equals(lang)) {
            return catalog.getNameEN();
        } else if ("ko".equals(lang)) {
            return catalog.getNameKR();
        } else {
            return catalog.getName(); // "ru" или дефолт
        }
    }

    public List<Catalog> getAllCatalogsForAddCosmetic() {
        String sql = "SELECT c.id, c.name FROM catalog c LEFT JOIN catalog child ON c.id = child.parent_id WHERE child.id IS NULL";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Catalog(
                        rs.getLong("id"),
                        rs.getString("name")
                ));
    }
}
