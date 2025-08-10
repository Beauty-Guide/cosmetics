package ru.cosmetic.server.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.Country;

@Repository
public interface CountryRepo extends CrudRepository<Country, Long> {
    Country findByNameRU(String nameRU);
}
