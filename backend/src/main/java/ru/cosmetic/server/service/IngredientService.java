package ru.cosmetic.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.cosmetic.server.models.Ingredient;
import ru.cosmetic.server.repo.IngredientRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepo ingredientRepo;

    public void save(Ingredient ingredient) {
        ingredientRepo.save(ingredient);
    }

    public boolean remove(Long id) {
        if (!ingredientRepo.existsById(id)) {
            return false;
        }
        ingredientRepo.deleteById(id);
        return true;
    }

    public Ingredient findById(Long id) {
        return ingredientRepo.findById(id).orElse(null);
    }
    public List<Ingredient> findById(List<Long> ingredientIds) {
        return ingredientRepo.findAllById(ingredientIds);
    }

    public List<Ingredient> findAll() {
        return ingredientRepo.findAll();
    }
}
