package ru.cosmetic.server.repo;

import ru.cosmetic.server.models.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {
    Collection<Role> findByName(String name);
}
