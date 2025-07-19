package ru.cosmetic.server.requestDto;

import lombok.Data;

@Data
public class UserRequest {

    private String username;
    private String email;
    private String password;
    private String confirmPassword;

    public UserRequest(String username, String email, String password, String confirmPassword) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}
