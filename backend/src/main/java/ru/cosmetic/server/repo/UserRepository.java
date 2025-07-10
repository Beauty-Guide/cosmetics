package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.cosmetic.server.models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
