package ru.cosmetic.server.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;
import ru.cosmetic.server.models.Cosmetic;
import ru.cosmetic.server.models.CosmeticAnalytic;
import ru.cosmetic.server.models.CosmeticMarketplaceLink;
import ru.cosmetic.server.models.User;
import ru.cosmetic.server.repo.AnalyticsRepo;
import ru.cosmetic.server.requestDto.AnalyticsRequest;
import ru.cosmetic.server.utils.JwtTokenUtils;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsRepo analyticsRepo;
    private final JwtTokenUtils jwtTokenUtils;
    private final UserService userService;

    @Transactional
    public void save(AnalyticsRequest request, String authHeader) {
        User user = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtTokenUtils.extractUserName(token);
                user = userService.findByEmail(email);
            } catch (Exception e) {
                // токен некорректный или истёк — считаем гостем
            }
        }
        CosmeticAnalytic analytic = buildAnalytic(request, user);
        analyticsRepo.save(analytic);
    }

    @Transactional
    public void save(AnalyticsRequest request, User user) {
        CosmeticAnalytic analytic = buildAnalytic(request, user);
        analyticsRepo.save(analytic);
    }

    private CosmeticAnalytic buildAnalytic(AnalyticsRequest request, User user) {
        return CosmeticAnalytic.builder()
                .cosmetic(request.getCosmeticId() != null ? new Cosmetic(request.getCosmeticId()) : null)
                .user(user)
                .action(request.getAction())
                .location(request.getLocation())
                .device(request.getDevice())
                .brandIds(request.getBrandIds())
                .actionIds(request.getActionIds())
                .skinTypeIds(request.getSkinTypeIds())
                .marketplaceLink(request.getMarketPlaceId() != null ? new CosmeticMarketplaceLink(request.getMarketPlaceId()) : null)
                .query(request.getQuery())
                .build();
    }
}
