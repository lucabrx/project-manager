package com.projectmeister.dtos;

import java.time.LocalDateTime;

import com.projectmeister.models.User;

public class UserResponse {
    final private Long id;
    final private String email;
    final private String name;
    final private LocalDateTime createdAt;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.createdAt = user.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
