package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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

@RestController
@RequiredArgsConstructor
@Tag(name = "Косметика", description = "Доступен только авторизованным пользователям с ролью ADMIN")
@RequestMapping("/api/files")
public class FileController {

    private final MinioService minioService;
    private final CosmeticImageService cosmeticImageService;
    private final CosmeticService cosmeticService;

    @PostMapping("/upload")
//    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("cosmeticId") Long cosmeticId, @RequestParam("file") MultipartFile image) throws Exception {
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("cosmeticId") Long cosmeticId, @RequestParam("image") MultipartFile image) throws Exception {

        String fileName = minioService.uploadFile(cosmeticId, image);
        String fileUrl = minioService.getFileUrl(fileName);
        CosmeticImage cosmeticImage = new CosmeticImage();
//        cosmeticImage.setCosmetic(cosmeticService.findById(cosmeticId));
        Cosmetic byId = cosmeticService.findById(cosmeticId);
        cosmeticImage.setUrl(image.getOriginalFilename());
        cosmeticImageService.save(cosmeticImage);


        Map<String, String> response = new HashMap<>();
        response.put("message", "Изображения загружены");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<String> getFileUrl(@PathVariable String fileName) throws Exception {
        String url = minioService.getFileUrl(fileName);
        return ResponseEntity.ok(url);
    }

    @DeleteMapping("/{fileName}")
    public ResponseEntity<Void> deleteFile(@PathVariable String fileName) throws Exception {
        minioService.deleteFile(fileName);
        return ResponseEntity.noContent().build();
    }
}