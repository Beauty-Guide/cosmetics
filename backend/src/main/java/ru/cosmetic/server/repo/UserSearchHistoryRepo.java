package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.models.UserSearchHistory;

import java.util.List;

@Repository
public interface UserSearchHistoryRepo extends JpaRepository<UserSearchHistory, Long> {
    List<UserSearchHistory> findAllByUser(User user);
}
