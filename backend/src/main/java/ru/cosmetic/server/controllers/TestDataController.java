package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.cosmetic.server.models.Catalog;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.service.*;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Tag(name = "Типы кожи", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/api")
public class TestDataController {

    private final CosmeticService cosmeticService;
    private final CosmeticActionService cosmeticActionService;
    private final SkinTypeService skinTypeService;
    private final IngredientService ingredientService;
    private final BrandService brandService;
    private final CatalogService catalogService;
    private final Random random = new Random();


    @GetMapping("/generate-cosmetics")
    public ResponseEntity<String> generateTestCosmetics() {
        int count = 100;
        int countI = 0;
        List<Cosmetic> allCosmetics = cosmeticService.getAllCosmetics();

        if (!allCosmetics.isEmpty()) {
            count = allCosmetics.size() + 5000;
            countI = allCosmetics.size() + 1;
        }

        for (int i = countI; i < count; i++) {
            try {
                Cosmetic cosmetic = new Cosmetic();

                cosmetic.setName("Косметика #" + (i + 1));
                cosmetic.setDescription("Описание косметики #" + (i + 1));
                cosmetic.setCompatibility("Подходит для всех типов кожи");
                cosmetic.setUsageRecommendations("Используйте утром и вечером");
                cosmetic.setApplicationMethod("Нанесите на чистую кожу");

                // Установка связи
                cosmetic.setBrand(brandService.findById(getRandomId(1, 153)));

                List<Catalog> leafCatalogs = catalogService.getAllCatalogsForAddCosmetic();
                if (!leafCatalogs.isEmpty()) {
                    int randomIndex = ThreadLocalRandom.current().nextInt(leafCatalogs.size());
                    cosmetic.setCatalog(leafCatalogs.get(randomIndex));
                }
                // Рандомные действия
                cosmetic.setActions(getRandomList(cosmeticActionService::findById, 1, 9, 1, 3));

                // Рандомные типы кожи
                cosmetic.setSkinTypes(getRandomList(skinTypeService::findById, 1, 6, 1, 3));

                // Рандомные ингредиенты
                cosmetic.setIngredients(getRandomList(ingredientService::findById, 1, 149, 1, 5));

                cosmeticService.save(cosmetic);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Ошибка при генерации косметики: " + e.getMessage());
            }
        }
        return ResponseEntity.ok("Создано " + count + " тестовых косметических продуктов.");
    }

    // Вспомогательный метод для получения случайного ID
    private Long getRandomId(int min, int max) {
        return (long) (random.nextInt(max - min + 1) + min);
    }

    // Вспомогательный метод для получения списка случайных элементов
    private <T> List<T> getRandomList(Function<Long, T> finder, int idMin, int idMax, int minSize, int maxSize) {
        int size = random.nextInt(maxSize - minSize + 1) + minSize;
        Set<Long> ids = new HashSet<>();
        while (ids.size() < size) {
            ids.add(getRandomId(idMin, idMax));
        }
        return ids.stream()
                .map(finder)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
