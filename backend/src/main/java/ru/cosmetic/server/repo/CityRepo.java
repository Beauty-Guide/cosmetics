package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.City;
import ru.cosmetic.server.models.Country;

@Repository
public interface CityRepo extends JpaRepository<City, Long> {
    City findByNameRUAndCountry(String nameRU, Country country);

    City findByNameRU(String countryRu);

}
