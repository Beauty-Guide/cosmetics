package ru.cosmetic.server.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import ru.cosmetic.server.models.Cosmetic;

import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class CosmeticsResponse {
    Integer total;
    List<CosmeticResponse> cosmetics;
}
