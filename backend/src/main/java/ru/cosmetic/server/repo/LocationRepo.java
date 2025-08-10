package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.cosmetic.server.models.City;
import ru.cosmetic.server.models.Country;
import ru.cosmetic.server.models.Location;

import java.util.List;

@Repository
public interface LocationRepo extends JpaRepository<Location, Long> {

    Location findByCountryAndCity(Country country, City city);
}
