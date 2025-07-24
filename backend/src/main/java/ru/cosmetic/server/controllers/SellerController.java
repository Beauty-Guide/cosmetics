package ru.cosmetic.server.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.cosmetic.server.service.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private final UserService userService;

    @GetMapping("/getAllSeller")
    @Operation(summary = "Получение всех продавцов")
    public ResponseEntity<?> getAllSeller() {
        try {
            return ResponseEntity.ok(userService.findAllByRole("ROLE_SELLER"));
        } catch (Exception e) {
            return new ResponseEntity<>("Ошибка получения продавцов", HttpStatus.BAD_REQUEST);
        }
    }
}

