package ru.cosmetic.server.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class ImageResponse {
    private UUID id;
    private String url;
    private Boolean isMain;
}
