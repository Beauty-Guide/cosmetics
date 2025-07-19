package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticImage;
import ru.cosmetic.server.service.CosmeticImageService;
import ru.cosmetic.server.service.CosmeticService;
import ru.cosmetic.server.service.MinioService;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Изображения", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/admin/files")
public class FileController {

    private final MinioService minioService;
    private final CosmeticImageService cosmeticImageService;
    private final CosmeticService cosmeticService;

    @PostMapping("/upload")
    @Operation(summary = "Загрузка изображения")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("cosmeticId") Long cosmeticId, @RequestParam("isMain") Boolean isMain, @RequestParam("image") MultipartFile image) throws Exception {
        Cosmetic cosmetic = cosmeticService.findById(cosmeticId);
        CosmeticImage cosmeticImage = new CosmeticImage();
        cosmeticImage.setCosmetic(cosmetic);
        cosmeticImage.setUrl("first");
        cosmeticImage.setMain(isMain);
        cosmeticImage = cosmeticImageService.save(cosmeticImage);
        String fileName = cosmeticId + "_" + cosmeticImage.getId() + ".jpg";
        String fileUrl = minioService.uploadFile(cosmeticId, fileName, image);
        cosmeticImage.setUrl(fileUrl);
        cosmeticImageService.save(cosmeticImage);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Изображения загружены");
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{fileName}")
    @Operation(summary = "Удаление изображения")
    public ResponseEntity<Void> deleteFile(@PathVariable String fileName) throws Exception {
        minioService.deleteFile(fileName);
        return ResponseEntity.noContent().build();
    }
}