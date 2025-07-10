package ru.cosmetic.server.responseDto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserResponse {
    String name;
    String role;
    List<UserSearchHistoryResponse> history;
}
