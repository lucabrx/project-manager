package com.projectmeister.dtos;

public class Token {
    private final String accessToken;
    private final String refreshToken;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public Token(String accessToken, String refreshToken, long accessTokenExpiration, long refreshTokenExpiration) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    public long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }

}
