package ru.cosmetic.server.responseDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    String name;
    String role;
}
