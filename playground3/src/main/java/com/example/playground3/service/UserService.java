package com.example.playground3.service;

import com.example.playground3.model.User;
import com.example.playground3.repository.UserRepository;
import com.example.playground3.util.HashUtil;
import com.example.playground3.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        User existingUser = userRepository.findUserByEmail(email);
        if (existingUser != null) {
            throw new IllegalStateException("User already exists");
        }
        String hashedPassword = HashUtil.hashPassword(password);
        return userRepository.createUser(email, hashedPassword);
    }

    public Map<String, String> login(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        if (!HashUtil.comparePassword(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String accessToken = JwtUtil.createAccessToken(user);
        String refreshToken = JwtUtil.createRefreshToken(user);
        return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
    }

    public String generateAccessToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Invalid token");
        }
        try {
            var claims = JwtUtil.verifyRefreshToken(token);
            User user = userRepository.findUserByEmail(claims.getSubject());
            if (user == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            return JwtUtil.createAccessToken(user);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid token");
        }
    }

    public User getProfile(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Invalid token");
        }
        try {
            var claims = JwtUtil.verifyAccessToken(token);
            User user = userRepository.findUserByEmail(claims.getSubject());
            if (user == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            return user;
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid token");
        }
    }
}
