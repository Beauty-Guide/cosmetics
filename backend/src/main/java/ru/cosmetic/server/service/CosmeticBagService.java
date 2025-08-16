package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.requestDto.CosmeticBagRequest;
import ru.cosmetic.server.responseDto.BrandResponse;
import ru.cosmetic.server.responseDto.CosmeticBagResponse;
import ru.cosmetic.server.responseDto.CosmeticResponse;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CosmeticBagService {

    private final JdbcTemplate jdbcTemplate;

    public void create(CosmeticBagRequest request, User creater) {
        jdbcTemplate.update(
                "INSERT INTO cosmetic_bag (name, owner_id, created_at, is_deleted, likes) " +
                        "VALUES (?, ?, ?, ?, ?)",
                request.getName(),
                creater.getId(),
                LocalDateTime.now(),
                false,
                0
        );
    }

    public void update(UUID bagId, CosmeticBagRequest request) {
        int updated = jdbcTemplate.update(
                "UPDATE cosmetic_bag SET name = ? WHERE id = ? AND is_deleted = false",
                request.getName(), bagId);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    public void delete(UUID bagId) {
        int updated = jdbcTemplate.update(
                "UPDATE cosmetic_bag SET is_deleted = true, deleted_at = ? WHERE id = ?",
                LocalDateTime.now(), bagId);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    public void addCosmeticToBag(UUID bagId, Long cosmeticId) {
        jdbcTemplate.update("INSERT INTO cosmetic_bag_item(bag_id, cosmetic_id) VALUES (?, ?) ON CONFLICT (bag_id, cosmetic_id) DO NOTHING", bagId, cosmeticId);
    }

    public void removeCosmeticFromBag(UUID bagId, Long cosmeticId) {
        jdbcTemplate.update("DELETE FROM cosmetic_bag_item WHERE bag_id = ? AND cosmetic_id = ?", bagId, cosmeticId);
    }

    public CosmeticBagResponse findById(UUID bagId) {
        List<CosmeticBagResponse> result = buildBagResponse("b.id = ?", null, bagId);
        return result.isEmpty() ? null : result.get(0);
    }

    public List<CosmeticBagResponse> listByOwner(Long ownerId, Long checkCosmeticId) {
        String whereClause = "b.owner_id = ? AND b.is_deleted = false";
        return buildBagResponse(whereClause, checkCosmeticId, ownerId);
    }

    private List<CosmeticBagResponse> buildBagResponse(String whereClause, Long checkCosmeticId, Object... params) {
        String hasCosmeticExpression = checkCosmeticId != null
                ? "EXISTS (SELECT 1 FROM cosmetic_bag_item cbi_check WHERE cbi_check.bag_id = b.id AND cbi_check.cosmetic_id = " + checkCosmeticId + ")"
                : "CASE WHEN c.id IS NOT NULL THEN true ELSE false END";

        String sql = """
        SELECT
            b.id,
            b.name,
            b.owner_id,
            b.created_at,
            b.likes,
            c.id AS cosmetic_id,
            c.name AS cosmetic_name,
            br.id as brand_id,
            br.name as brand_name,
            %s AS has_cosmetic
        FROM cosmetic_bag b
        LEFT JOIN cosmetic_bag_item cbi ON b.id = cbi.bag_id
        LEFT JOIN cosmetic c ON c.id = cbi.cosmetic_id
        LEFT JOIN brand br ON br.id = c.brand_id
        WHERE %s
        ORDER BY b.id, c.id
        """.formatted(hasCosmeticExpression, whereClause);

        Map<UUID, CosmeticBagResponse> map = new LinkedHashMap<>();

        jdbcTemplate.query(
                sql,
                params,
                (rs, rowNum) -> {
                    UUID bagId = (UUID) rs.getObject("id");
                    CosmeticBagResponse bag = map.computeIfAbsent(
                            bagId,
                            k -> {
                                try {
                                    return CosmeticBagResponse.builder()
                                            .id("cosmeticBag_" + bagId)
                                            .name(rs.getString("name"))
                                            .ownerId(rs.getLong("owner_id"))
                                            .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                                            .likes(rs.getInt("likes"))
                                            .hasCosmetic(rs.getBoolean("has_cosmetic"))
                                            .cosmetics(new ArrayList<>())
                                            .build();
                                } catch (SQLException e) {
                                    throw new RuntimeException(e);
                                }
                            }
                    );

                    Long cosmeticId = rs.getObject("cosmetic_id", Long.class);
                    if (cosmeticId != null) {
                        bag.getCosmetics().add(
                                CosmeticResponse.builder()
                                        .id(cosmeticId)
                                        .name(rs.getString("cosmetic_name"))
                                        .brand(BrandResponse.builder().id(rs.getLong("brand_id")).name(rs.getString("brand_name")).build())
                                        .build()
                        );
                    }
                    return null;
                }
        );

        return new ArrayList<>(map.values());
    }
}