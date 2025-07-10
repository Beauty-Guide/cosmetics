package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameterValue;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.models.UserSearchHistory;
import ru.cosmetic.server.repo.UserSearchHistoryRepo;
import ru.cosmetic.server.responseDto.UserSearchHistoryResponse;

import java.sql.Types;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserSearchHistoryService {

    private final UserSearchHistoryRepo userSearchHistoryRepo;
    private final JdbcTemplate jdbcTemplate;

    public void save(UserSearchHistory userSearchHistory) {
        userSearchHistoryRepo.save(userSearchHistory);
    }

    public UserSearchHistory findById(Long id) {
        return userSearchHistoryRepo.findById(id).orElse(null);
    }

    public boolean remove(Long id) {
        UserSearchHistory history = findById(id);
        history.setDeleted(true);
        save(history);
        return true;
    }

    public List<UserSearchHistoryResponse> findHistoryByUserId(Long userId) {
        String sql = """
        SELECT id, search_query 
        FROM user_search_history
        WHERE user_id = ? AND deleted = false
        ORDER BY searched_at DESC
    """;

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, userId);
            return rows.stream()
                    .map(this::mapRowToUserSearchHistoryResponse)
                    .toList();
        } catch (EmptyResultDataAccessException ex) {
            return Collections.emptyList(); // или обработать иначе
        }
    }

    private UserSearchHistoryResponse mapRowToUserSearchHistoryResponse(Map<String, Object> row) {
        UserSearchHistoryResponse dto = new UserSearchHistoryResponse();
        dto.setId((Long) row.get("id"));
        dto.setSearchQuery((String) row.get("search_query"));
        return dto;
    }
}
