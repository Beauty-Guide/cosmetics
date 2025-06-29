package ru.cosmetic.server.dtos;

import lombok.Data;

@Data
public class JwtRequest {
    private String username;
    private String password;
}
