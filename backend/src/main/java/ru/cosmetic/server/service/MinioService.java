package ru.cosmetic.server.service;

import io.minio.*;
import io.minio.http.Method;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class MinioService {

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucketName}")
    private String bucketName;

    // Создать бакет, если его нет
    public void createBucketIfNotExists() throws Exception {
        boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
        if (!found) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }
    }

    // Загрузка файла
    public String uploadFile(Long cosmeticId, String fileName, MultipartFile file) throws Exception {
        String objectKey = cosmeticId + "/" + fileName;
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectKey)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        return fileName;
    }

    public byte[] getFile(String fileName) {
        try {
            GetObjectArgs objectArgs = GetObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .build();
            try (InputStream is = minioClient.getObject(objectArgs)) {
                return IOUtils.toByteArray(is);
            }
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении файла из MinIO", e);
        }
    }

    public String getContentType(String fileName) {
        // Можно использовать Apache Tika или простое определение по расширению:
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.endsWith(".png")) {
            return "image/png";
        } else if (fileName.endsWith(".gif")) {
            return "image/gif";
        } else {
            return "application/octet-stream";
        }
    }

    // Получение URL файла
    public String getFileUrl(String fileName) throws Exception {
        return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket(bucketName)
                        .object(fileName)
                        .build()
        );
    }

    // Удаление файла
    public void deleteFile(String fileName) throws Exception {
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .build()
        );
    }
}