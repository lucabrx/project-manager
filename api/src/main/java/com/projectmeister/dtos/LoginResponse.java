package com.projectmeister.dtos;

public class LoginResponse {
    private final UserResponse user;
    private final Token token;

    public LoginResponse(UserResponse user, Token token) {
        this.user = user;
        this.token = token;
    }

    public UserResponse getUser() {
        return user;
    }

    public Token getToken() {
        return token;
    }

}
