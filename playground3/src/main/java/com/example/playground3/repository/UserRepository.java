package com.example.playground3.repository;

import com.example.playground3.model.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class UserRepository {

    private final List<User> users = new ArrayList<>();

    public User findUserByEmail(String email) {
        return users.stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }

    public User createUser(String email, String hashedPassword) {
        User user = new User(email, hashedPassword);
        users.add(user);
        return user;
    }
}
