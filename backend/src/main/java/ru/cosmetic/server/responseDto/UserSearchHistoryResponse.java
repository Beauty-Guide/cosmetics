package ru.cosmetic.server.responseDto;

import lombok.Data;

@Data
public class UserSearchHistoryResponse {

    private Long id;
    private String searchQuery;

}
