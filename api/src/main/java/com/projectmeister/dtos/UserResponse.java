package com.projectmeister.dtos;


import java.util.Date;

import com.projectmeister.models.User;

public class UserResponse {
    final private Long id;
    final private String email;
    final private String name;
    final private Date createdAt;

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

    public Date getCreatedAt() {
        return createdAt;
    }
}
