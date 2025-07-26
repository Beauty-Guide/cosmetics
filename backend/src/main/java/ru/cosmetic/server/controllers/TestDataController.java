package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.cosmetic.server.enums.ActionType;
import ru.cosmetic.server.models.*;
import ru.cosmetic.server.service.*;

import java.io.*;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Function;
import java.util.stream.Collectors;


@RestController
@RequiredArgsConstructor
@Tag(name = "Генерация", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/api")
public class TestDataController {

    private final CosmeticService cosmeticService;
    private final CosmeticActionService cosmeticActionService;
    private final SkinTypeService skinTypeService;
    private final IngredientService ingredientService;
    private final BrandService brandService;
    private final CatalogService catalogService;
    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();
    private final FavoriteService favoriteService;
    private final MinioService minioService;
    private final CosmeticImageService cosmeticImageService;
    private final CosmeticMarketplaceLinkService cosmeticMarketplaceLinkService;
    private final AnalyticsService analyticsService;
    // Ключ — ID родительской категории (например, "Очищение" = 1)
    public static final Map<Long, List<String>> COSMETIC_TEMPLATES = Map.ofEntries(
            // --- Очищение ---
            Map.entry(12L, List.of("HydraCleanse Oil Cleanser", "Green Tea Cleansing Oil", "Gentle Makeup Remover Oil", "Deep Pore Cleansing Oil", "Mild Oil Cleanser for Sensitive Skin")),
            Map.entry(13L, List.of("Foaming Cleanser for Oily Skin", "Hydrating Gel Cleanser", "Daily Foaming Cleanser", "Deep Cleansing Gel", "Cleansing Foam with Green Tea")),
            Map.entry(14L, List.of("Micellar Water for Sensitive Skin", "Oil-Free Micellar Cleanser", "Brightening Micellar Water", "Micellar Cleanser with Aloe", "Micellar Water with Chamomile")),
            Map.entry(15L, List.of("Powder Cleanser for Deep Clean", "Jelly Cleanser for Sensitive Skin", "Foaming Powder Cleanser", "Gentle Powder Cleanser", "Purifying Jelly Cleanser")),
            Map.entry(16L, List.of("AHA/BHA Exfoliating Cleanser", "Enzyme Peel Cleanser", "Gommage Cleanser", "AHA Exfoliating Cleanser", "BHA Deep Pore Cleanser")),
            Map.entry(17L, List.of("Gentle Facial Scrub", "Facial Exfoliating Scrub", "Natural Face Scrub with Jojoba", "Exfoliating Face Scrub", "Facial Scrub with Apricot")),
            Map.entry(18L, List.of("Clay Cleansing Face Mask", "Charcoal Cleansing Mask", "Detoxifying Clay Mask", "Deep Cleansing Clay Mask", "Charcoal Blackhead Remover Mask")),
            Map.entry(19L, List.of("Exfoliating Toner", "PHA Brightening Toner", "BHA Pore Refining Toner", "AHA/BHA Exfoliating Toner", "Gentle Exfoliating Toner")),

            // --- Тонеры и эссенции ---
            Map.entry(20L, List.of("Hydrating Toner for Dry Skin", "Moisturizing Toner", "Hydrating Facial Toner", "Water-Locked Hydrating Toner", "Daily Hydrating Toner")),
            Map.entry(21L, List.of("Soothing Toner for Sensitive Skin", "Calming Toner with Centella", "Redness Relief Toner", "Gentle Soothing Toner", "Soothing Toner with Aloe")),
            Map.entry(22L, List.of("AHA/BHA Acne Fighting Toner", "PHA Toner for Sensitive Skin", "BHA Acne Control Toner", "AHA Toner for Brightening", "Salicylic Acid Toner")),
            Map.entry(23L, List.of("Brightening Essence", "Anti-Aging Essence", "Hydrating Essence", "Essence with Niacinamide", "Revitalizing Skin Essence")),
            Map.entry(24L, List.of("Skin Boosting Booster", "Vitamin C Boosting Serum", "Hyaluronic Acid Booster", "Collagen Boosting Serum", "Brightening Skin Booster")),

            // --- Сыворотки и ампулы ---
            Map.entry(25L, List.of("Vitamin C Brightening Serum", "C Vitamin Glow Serum", "Antioxidant Vitamin C Serum", "C+E Ferulic Acid Serum", "Vitamin C Anti-Aging Serum")),
            Map.entry(26L, List.of("Niacinamide Brightening Serum", "Niacinamide 10% Serum", "Serum with Niacinamide and Zinc", "Niacinamide for Pores", "Pore Minimizing Niacinamide Serum")),
            Map.entry(27L, List.of("Peptide Anti-Wrinkle Serum", "Multi-Peptide Serum", "Peptide Serum for Firming Skin", "Peptide Regenerating Serum", "Peptide + Hyaluronic Acid Serum")),
            Map.entry(28L, List.of("Centella Calming Serum", "Centella Soothing Serum", "Centella Skin Repair Serum", "Centella Acne Relief Serum", "Centella Anti-Inflammatory Serum")),
            Map.entry(29L, List.of("Ceramide Moisturizing Serum", "Ceramide Barrier Repair Serum", "Ceramide Replenishing Serum", "Ceramide Complex Serum", "Ceramide Hydrating Serum")),
            Map.entry(30L, List.of("Retinol Anti-Aging Serum", "Retinol Night Serum", "Retinol Wrinkle Reducing Serum", "Retinol Brightening Serum", "Retinol Renewing Serum")),
            Map.entry(31L, List.of("AHA/BHA Acne Clear Serum", "PHA Brightening Serum", "BHA Acne Treatment Serum", "AHAs Exfoliating Serum", "Acid Serum for Pores")),
            Map.entry(32L, List.of("Hydrating Serum for Dry Skin", "Intensive Hydration Serum", "Hyaluronic Acid Hydrating Serum", "24H Hydrating Serum", "Hydrating Serum with Aloe")),
            Map.entry(33L, List.of("Anti-Inflammatory Soothing Serum", "Soothing Serum for Sensitive Skin", "Calming Serum with Chamomile", "Redness Relief Serum", "Anti-Inflammatory Serum")),
            Map.entry(34L, List.of("Brightening Serum for Pigmentation", "Dark Spot Correcting Serum", "Pigmentation Reducing Serum", "Brightening Vitamin C Serum", "Pigmentation Treatment Serum")),

            // --- Кремы и эмульсии ---
            Map.entry(35L, List.of("Hydrating Cream", "Daily Moisturizing Cream", "Hydrating Day Cream", "24H Hydrating Cream", "Hydrating Cream with Hyaluronic Acid")),
            Map.entry(36L, List.of("Nourishing Cream for Dry Skin", "Rich Nourishing Cream", "Intensive Nourishing Cream", "Nourishing Cream with Ceramides", "Night Nourishing Cream")),
            Map.entry(37L, List.of("Ceramide Moisturizing Cream", "Ceramide Barrier Cream", "Ceramide Rich Cream", "Ceramide Hydrating Cream", "Ceramide Skin Repair Cream")),
            Map.entry(38L, List.of("Oil-Control Mattifying Cream", "Matte Finish Cream", "Sebum Control Cream", "Mattifying Cream for Oily Skin", "Oil-Control Cream with Niacinamide")),
            Map.entry(39L, List.of("Anti-Inflammatory Cream", "Soothing Cream for Sensitive Skin", "Anti-Redness Cream", "Inflammation Relief Cream", "Calming Cream")),
            Map.entry(40L, List.of("Anti-Wrinkle Cream", "Wrinkle Reducing Cream", "Anti-Aging Cream", "Collagen-Boosting Cream", "Firming Anti-Aging Cream")),
            Map.entry(41L, List.of("Brightening Cream for Pigmentation", "Pigmentation Correcting Cream", "Dark Spot Brightening Cream", "Brightening Cream with Vitamin C", "Pigmentation Reduction Cream")),
            Map.entry(42L, List.of("SPF 30 Daily Cream", "Moisturizer with SPF 30", "SPF 50 Cream", "Sunscreen Cream with SPF", "Day Cream with SPF 30")),

            // --- Уход за глазами ---
            Map.entry(43L, List.of("Eye Cream for Dark Circles", "Eye Cream for Wrinkles", "Anti-Aging Eye Cream", "Hydrating Eye Cream", "Eye Cream for Puffiness")),
            Map.entry(44L, List.of("Under Eye Patches", "Brightening Eye Patches", "Hydrating Eye Patches", "Eye Patches for Dark Circles", "Anti-Fatigue Eye Patches")),
            Map.entry(45L, List.of("Eye Area Serum", "Eye Serum for Wrinkles", "Brightening Eye Serum", "Eye Serum for Dark Circles", "Hydrating Eye Serum")),

            // --- Маски ---
            Map.entry(46L, List.of("Hydrating Sheet Mask", "Brightening Sheet Mask", "Moisturizing Sheet Mask", "Anti-Aging Sheet Mask", "Cleansing Sheet Mask")),
            Map.entry(47L, List.of("Hydrating Wash-Off Mask", "Cleansing Wash-Off Mask", "Brightening Wash-Off Mask", "Exfoliating Wash-Off Mask", "Detoxifying Wash-Off Mask")),
            Map.entry(48L, List.of("Alginate Facial Mask", "Alginate Lifting Mask", "Alginate Skin Tightening Mask", "Alginate Detox Mask", "Alginate Rejuvenating Mask")),
            Map.entry(49L, List.of("Stick Mask for Spot Treatment", "Targeted Stick Mask", "Stick Mask for Acne", "Stick Mask for Dry Patches", "Stick Mask for Blemishes")),
            Map.entry(50L, List.of("Splash Water Mask", "Hydrating Splash Mask", "Cooling Splash Mask", "Brightening Splash Mask", "Refreshing Splash Mask")),

            // --- Солнцезащитные средства ---
            Map.entry(51L, List.of("Sunscreen Cream SPF 50", "Daily Sunscreen Cream SPF 30", "Moisturizing Sunscreen Cream SPF 50", "Sunscreen Cream for Face", "SPF 50+ Cream")),
            Map.entry(52L, List.of("Sunscreen Gel SPF 50", "Lightweight Sunscreen Gel", "Non-Greasy Sunscreen Gel", "Sunscreen Gel for Oily Skin", "Sunscreen Gel with Aloe")),
            Map.entry(53L, List.of("Sunscreen Stick SPF 50", "Portable Sunscreen Stick", "Sunscreen Stick for Face", "SPF Stick for Touch-Ups", "Sunscreen Stick with Zinc")),
            Map.entry(54L, List.of("Sunscreen Spray SPF 50", "Face Sunscreen Spray", "Water-Resistant Sunscreen Spray", "Sunscreen Mist SPF 50", "Spray Sunscreen for Face")),
            Map.entry(55L, List.of("Powder Sunscreen with SPF 50", "SPF Powder for Face", "Mineral Powder Sunscreen", "Powder Sunscreen for Oily Skin", "Touch-Up Powder with SPF")),

            // --- Ночной уход ---
            Map.entry(56L, List.of("Night Sleeping Mask", "Hydrating Night Mask", "Overnight Recovery Mask", "Night Repair Mask", "Sleeping Mask for Skin Renewal")),
            Map.entry(57L, List.of("Night Cream for Skin Recovery", "Restorative Night Cream", "Night Cream for Sensitive Skin", "Night Cream with Ceramides", "Overnight Recovery Cream")),

            // --- Уход за проблемной кожей ---
            Map.entry(58L, List.of("Salicylic Acid Acne Treatment", "BHA Acne Clearing Serum", "Salicylic Acid Spot Treatment", "Acne Treatment with Salicylic Acid", "Pore-Clearing Acne Serum")),
            Map.entry(59L, List.of("Centella Acne Relief Serum", "Centella Acne Treatment", "Centella Soothing Acne Serum", "Centella Blemish Cream", "Centella Acne Spot Gel")),
            Map.entry(60L, List.of("Acne Spot Treatment Gel", "Spot Correcting Cream", "Acne Patch with Tea Tree Oil", "Blemish Correcting Serum", "Acne Spot Corrector")),

            // --- Дополнительные средства ---
            Map.entry(61L, List.of("Hydrating Facial Mist", "Brightening Facial Mist", "Soothing Facial Mist", "Hydrating Rose Mist", "Facial Mist with Hyaluronic Acid")),
            Map.entry(62L, List.of("Skincare-Infused Primer", "Primer with Hydration Benefits", "Makeup-Enhancing Skincare Primer", "Primer with Niacinamide", "Skincare Primer for Oily Skin")),
            Map.entry(63L, List.of("Pre-Cleansing Oil", "Post-Cleansing Toner", "Cleansing Routine Starter", "Before & After Cleansing Kit", "Cleansing Prep & Recovery Serum")),
            Map.entry(64L, List.of("Nose Blackhead Patches", "Chin Acne Patches", "Nose Strips with Salicylic Acid", "Blackhead Removal Patches", "Pimple Patches for Nose")),

            // --- Уход за губами ---
            Map.entry(65L, List.of("Hydrating Lip Balm", "Lip Balm with SPF", "Nourishing Lip Balm", "Lip Balm with Shea Butter", "Lip Balm for Dry Lips")),
            Map.entry(66L, List.of("Lip Scrub with Sugar", "Gentle Lip Exfoliator", "Lip Scrub with Coconut Oil", "Lip Scrub with Peppermint", "Exfoliating Lip Polish")),
            Map.entry(67L, List.of("Lip Mask with Hyaluronic Acid", "Lip Sleeping Mask", "Hydrating Lip Mask", "Lip Mask for Dry Lips", "Lip Mask with Vitamin E"))
    );

    public static String getRandomNameForCatalogId(Long catalogId) {
        List<String> names = COSMETIC_TEMPLATES.getOrDefault(catalogId, List.of("Cosmetic Product", "Skincare Item", "Beauty Product"));
        return names.get(new Random().nextInt(names.size()));
    }

    @GetMapping("/generate-cosmetics")
    public ResponseEntity<String> generateTestCosmetics() {
        int count = 100;
        int countI = 0;
        List<Cosmetic> allCosmetics = cosmeticService.getAllCosmetics();

        if (!allCosmetics.isEmpty()) {
            count = allCosmetics.size() + 5000;
            countI = allCosmetics.size() + 1;
        } else {
            count = 100;
        }
        int imageCount = 18; // картинок от 1.jpg до 18.jpg
        for (int i = countI; i < count; i++) {
            try {
                Cosmetic cosmetic = new Cosmetic();
                cosmetic.setCompatibility("Подходит для всех типов кожи");
                cosmetic.setUsageRecommendations("Используйте утром и вечером");
                cosmetic.setApplicationMethod("Нанесите на чистую кожу");

                // Установка связи
                cosmetic.setBrand(brandService.findById(getRandomId(1, 153)));

                List<Catalog> leafCatalogs = catalogService.getAllCatalogsForAddCosmetic();
                Catalog randomCatalog = leafCatalogs.get(new Random().nextInt(leafCatalogs.size()));
                cosmetic.setCatalog(randomCatalog);
                // Генерируем имя на основе категории
                cosmetic.setName(getRandomNameForCatalogId(randomCatalog.getId()));
                // Рандомные действия
                cosmetic.setActions(getRandomList(cosmeticActionService::findById, 1, 9, 1, 3));

                // Рандомные типы кожи
                cosmetic.setSkinTypes(getRandomList(skinTypeService::findById, 1, 6, 1, 3));

                // Рандомные ингредиенты
                cosmetic.setIngredients(getRandomList(ingredientService::findById, 1, 149, 1, 5));
                cosmetic = cosmeticService.save(cosmetic); // Сохраняем, чтобы получить ID

                CosmeticMarketplaceLink link = new CosmeticMarketplaceLink();
                link.setCosmetic(cosmetic);
                link.setUser(new User(3l));
                link.setProductLink("http://localhost:3000");
                link.setLocation("RU");
                link.setMarketplaceName("OZON");
                cosmeticMarketplaceLinkService.save(link);

                // Теперь добавляем изображение
                CosmeticImage cosmeticImage = new CosmeticImage();
                cosmeticImage.setCosmetic(cosmetic);
                cosmeticImage.setMain(true); // или false, если нужно несколько


                // Выбираем случайное изображение из resources
                int randomImageIndex = new Random().nextInt(imageCount) + 1;
                String originalFileName = randomImageIndex + ".jpg";
                String resourcePath = "images/" + originalFileName;

                // Получаем InputStream из ресурсов
                InputStream imageStream = getClass().getResourceAsStream("/" + resourcePath);
                if (imageStream == null) {
                    throw new IOException("Файл не найден в ресурсах: " + resourcePath);
                }
                byte[] fileBytes = readStream(imageStream); // метод для чтения InputStream в byte[]

                MultipartFile multipartFile = new MultipartFile() {
                    @Override
                    public String getName() {
                        return "file";
                    }

                    @Override
                    public String getOriginalFilename() {
                        return originalFileName;
                    }

                    @Override
                    public String getContentType() {
                        return "image/jpeg";
                    }

                    @Override
                    public boolean isEmpty() {
                        return fileBytes == null || fileBytes.length == 0;
                    }

                    @Override
                    public long getSize() {
                        return fileBytes.length;
                    }

                    @Override
                    public byte[] getBytes() throws IOException {
                        return fileBytes;
                    }

                    @Override
                    public InputStream getInputStream() throws IOException {
                        return new ByteArrayInputStream(fileBytes);
                    }

                    @Override
                    public Resource getResource() {
                        return MultipartFile.super.getResource();
                    }

                    @Override
                    public void transferTo(Path dest) throws IOException, IllegalStateException {
                        MultipartFile.super.transferTo(dest);
                    }

                    @Override
                    public void transferTo(File dest) throws IOException, IllegalStateException {
                        try (FileOutputStream output = new FileOutputStream(dest)) {
                            output.write(fileBytes);
                        }
                    }
                };

                cosmeticImage = cosmeticImageService.save(cosmeticImage);
                // Генерируем имя файла в MinIO
                String fileName = cosmetic.getId() + "_" + cosmeticImage.getId() + ".jpg";

                // Загружаем файл в MinIO
                String fileUrl = minioService.uploadFile(cosmetic.getId(), fileName, multipartFile);

                // Обновляем URL и сохраняем
                cosmeticImage.setUrl(fileUrl);
                cosmeticImageService.save(cosmeticImage);
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

    private byte[] readStream(InputStream inputStream) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;

        while ((length = inputStream.read(buffer)) != -1) {
            byteArrayOutputStream.write(buffer, 0, length);
        }

        return byteArrayOutputStream.toByteArray();
    }

    @GetMapping("/generate-users")
    public ResponseEntity<String> generateTestUsers() {
        for (int i = 0; i < 1000; i++) {
            User user = new User();
            user.setUsername("user" + i);
            user.setPassword(passwordEncoder.encode("user" + i));
            user.setEmail("user" + i +"@gmail.com");
            user.setRoles(Collections.singleton(roleService.getUserRole()));
            user.setProvider("local");

            userService.createUser(user);
        }
        return ResponseEntity.ok("Создано " + 1000 + " тестовых пользователей.");
    }
    @GetMapping("/generate-favorites")
    public ResponseEntity<String> generateUserFavorites(
            @RequestParam(defaultValue = "1") int minFavorites,
            @RequestParam(defaultValue = "20") int maxFavorites) {

        List<User> allUsers = userService.getAllUsers();
        List<Cosmetic> allCosmetics = cosmeticService.getAllCosmetics();

        if (allUsers.isEmpty() || allCosmetics.isEmpty()) {
            return ResponseEntity.badRequest().body("Нет пользователей или косметики для генерации избранного");
        }

        int totalAdded = 0;

        for (User user : allUsers) {
            int favoritesCount = random.nextInt(maxFavorites - minFavorites + 1) + minFavorites;
            Set<Long> addedCosmetics = new HashSet<>();

            for (int i = 0; i < favoritesCount; i++) {
                Cosmetic randomCosmetic = getRandomCosmetic(allCosmetics);
                if (addedCosmetics.contains(randomCosmetic.getId())) {
                    i--; // Попробовать ещё раз, чтобы не добавлять дубли
                    continue;
                }

                try {
                    favoriteService.addToFavorites(user.getEmail(), randomCosmetic.getId());
                    addedCosmetics.add(randomCosmetic.getId());
                    totalAdded++;
                } catch (RuntimeException ignored) {
                    i--; // Пропустить, если уже в избранном
                }
            }
        }

        return ResponseEntity.ok("Успешно добавлено " + totalAdded + " записей избранного для " + allUsers.size() + " пользователей.");
    }

    private Cosmetic getRandomCosmetic(List<Cosmetic> cosmetics) {
        return cosmetics.get(random.nextInt(cosmetics.size()));
    }

    private static final List<String> LOCATIONS = List.of("RU", "US", "KR", "EU");
    private static final List<String> DEVICES   = List.of("mobile", "desktop", "tablet");
    private static final List<ActionType> ACTIONS = List.of(ActionType.VIEW);

    @GetMapping("/generate-analitic")
    public void generateRandomAnalytics() {
        // 100 существующих товаров
        List<Cosmetic> cosmetics = cosmeticService.findAll().stream().limit(100).toList();


        for (int i = 0; i < cosmetics.size(); i++) {
            Cosmetic cosmetic = cosmetics.get(random.nextInt(cosmetics.size()));
            User user = userService.findByEmail("admin@gmail.com");
            CosmeticAnalytic analytic = CosmeticAnalytic.builder()
                    .cosmetic(cosmetic)
                    .user(user)
                    .action(ACTIONS.get(random.nextInt(ACTIONS.size())))
                    .location(LOCATIONS.get(random.nextInt(LOCATIONS.size())))
                    .device(DEVICES.get(random.nextInt(DEVICES.size())))
                    .createdAt(LocalDateTime.now().minusDays(random.nextInt(365)))
                    .query(random.nextBoolean() ? "search " + cosmetic.getName() : null)
                    .build();

            analyticsService.save(analytic);
        }
    }
}
