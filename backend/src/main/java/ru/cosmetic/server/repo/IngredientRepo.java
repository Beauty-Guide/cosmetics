package ru.cosmetic.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.cosmetic.server.models.Ingredient;

public interface IngredientRepo extends JpaRepository<Ingredient, Long> {
}
