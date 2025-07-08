package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.SkinType;
import ru.cosmetic.server.repo.SkinTypeRepo;
import ru.cosmetic.server.responseDto.SkinTypeResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkinTypeService {

    private final SkinTypeRepo skinTypeRepo;
    private final JdbcTemplate jdbcTemplate;

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

    public List<SkinTypeResponse> findAll(String lang) {
        String sql = "SELECT id, name, name_en, name_kr FROM skin_type";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            String nameToUse = switch (lang == null ? "ru" : lang.toLowerCase()) {
                case "en" -> rs.getString("name_en");
                case "kr" -> rs.getString("name_kr");
                default -> rs.getString("name");
            };
            return new SkinTypeResponse(rs.getLong("id"), nameToUse);
        });
    }

}
