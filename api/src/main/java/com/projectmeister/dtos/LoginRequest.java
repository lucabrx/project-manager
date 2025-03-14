package com.projectmeister.dtos;



public class LoginRequest {
    final private String email;
    final private String password;

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }


    public String getEmail() {
        return email;
    }
    public String getPassword() {
        return password;
    }

}
