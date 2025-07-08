package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.CosmeticAction;
import ru.cosmetic.server.repo.CosmeticActionRepo;
import ru.cosmetic.server.responseDto.ActionResponse;
import ru.cosmetic.server.responseDto.SkinTypeResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CosmeticActionService {

    private final CosmeticActionRepo cosmeticActionRepo;
    private final JdbcTemplate jdbcTemplate;

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
        return cosmeticActionRepo.findById(id).orElse(null);
    }

    public List<CosmeticAction> findAllById(List<Long> ids) {
        return cosmeticActionRepo.findAllById(ids);
    }

    public List<CosmeticAction> findAll() {
        return cosmeticActionRepo.findAll();
    }

    public List<ActionResponse> findAll(String lang) {
        String sql = "SELECT id, name, name_en, name_kr FROM cosmetic_action";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            String nameToUse = switch (lang == null ? "ru" : lang.toLowerCase()) {
                case "en" -> rs.getString("name_en");
                case "ko" -> rs.getString("name_kr");
                default -> rs.getString("name");
            };
            return new ActionResponse(rs.getLong("id"), nameToUse);
        });
    }
}
