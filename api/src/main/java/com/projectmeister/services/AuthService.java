

package com.projectmeister.services;

import java.util.Set;

import com.projectmeister.dtos.LoginRequest;
import com.projectmeister.dtos.LoginResponse;
import com.projectmeister.dtos.RegisterRequest;
import com.projectmeister.dtos.Token;
import com.projectmeister.dtos.UserResponse;
import com.projectmeister.models.User;
import com.projectmeister.repositories.UserRepository;

import at.favre.lib.crypto.bcrypt.BCrypt;
import io.quarkus.security.UnauthorizedException;
import io.smallrye.jwt.auth.principal.JWTParser;
import io.smallrye.jwt.auth.principal.ParseException;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthService {

    @Inject
    UserRepository userRepository;

    @Inject
    JWTParser parser;

    @Transactional
    public UserResponse registerUser(RegisterRequest request) {
        String rawPassword = request.getPassword();
        String hashedPassword = hashPassword(rawPassword);
        var user = new User(request.getName(), request.getEmail(), hashedPassword);
        user.setPassword(hashedPassword);
        userRepository.persist(user);
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.find("email", email).firstResult();
        if (user == null) {
            throw new UnauthorizedException("User not found");
        }
        return new UserResponse(user);
    }

     public LoginResponse authenticate(LoginRequest request) {
        User user = userRepository.find("email", request.getEmail()).firstResult();
            if (user == null) {
            throw new UnauthorizedException("Invalid credentials");
        }

        System.out.println(user.getPassword());
        boolean verified = verifyPassword(request.getPassword(), user.getPassword());

        if (!verified) {
            throw new UnauthorizedException("Invalid credentials");
        }
        var userRes = new UserResponse(user);
        var token = generateToken(user);
        return new LoginResponse(userRes, token);
    }

    public Token refreshTokens(String token)  {
        try{
        var jwt = parser.parse(token);

        if (!"refresh".equals(jwt.getClaim("type"))) {
            throw new UnauthorizedException("Invalid token type");
        }

        if (jwt.getExpirationTime() < System.currentTimeMillis() / 1000) {
            throw new UnauthorizedException("Token expired");
        }

        String email = jwt.getSubject();
        User user = userRepository.find("email", email).firstResult();
        if (user == null) {
            throw new UnauthorizedException("User not found");
        }

        return generateToken(user);
        } catch (ParseException e) {
            throw new UnauthorizedException("Invalid token");
        }
    }

    public UserResponse getUserResponse(String email) {
        User user = userRepository.find("email", email).firstResult();
        if (user == null) {
            throw new UnauthorizedException("User not found");
        }
        return new UserResponse(user);
    }

    public User getUser(String email) {
        User user = userRepository.find("email", email).firstResult();
        if (user == null) {
            throw new UnauthorizedException("User not found");
        }
        return user;
    }

    private Token generateToken(User user) {
        long accessTokenExpiration = 3600;
        long refreshTokenExpiration = 3600 * 24 * 7;

        String accessToken = Jwt.issuer("projectmeister")
            .subject(user.getEmail())
            .upn(user.getEmail())
            .groups(Set.of(user.getRole()))
            .claim("type", "access")
            .expiresIn(accessTokenExpiration)
            .sign();

        String refreshToken = Jwt.issuer("projectmeister")
            .subject(user.getEmail())
            .upn(user.getEmail())
            .groups(Set.of(user.getRole()))
            .claim("type", "refresh")
            .expiresIn(refreshTokenExpiration)
            .sign();

        return new Token(accessToken, refreshToken, accessTokenExpiration, refreshTokenExpiration);

    }

    private String hashPassword(String password) {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray());
    }

    private boolean verifyPassword(String plainText, String hashed) {
        return BCrypt.verifyer().verify(plainText.toCharArray(), hashed).verified;
    }

}
