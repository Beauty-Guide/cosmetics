package ru.cosmetic.server.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.cosmetic.server.service.MinioService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final MinioService minioService;

    public FileController(MinioService minioService) {
        this.minioService = minioService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        String fileName = minioService.uploadFile(file);
        String fileUrl = minioService.getFileUrl(fileName);

        Map<String, String> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("fileUrl", fileUrl);

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