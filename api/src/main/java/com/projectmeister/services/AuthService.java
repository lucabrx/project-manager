

package com.projectmeister.services;

import com.projectmeister.dtos.UserResponse;
import com.projectmeister.models.User;
import com.projectmeister.repositories.UserRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthService {

    @Inject
    UserRepository userRepository;

    @Transactional
    public UserResponse registerUser(User user) {
        userRepository.persist(user);
        return new UserResponse(user);
    }


}
