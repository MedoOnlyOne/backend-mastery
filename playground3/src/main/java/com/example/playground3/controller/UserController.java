package com.example.playground3.controller;

import com.example.playground3.model.User;
import com.example.playground3.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        User user = userService.registerUser(email, password);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("email", user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        Map<String, String> tokens = userService.login(email, password);
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> generateAccessToken(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newAccessToken = userService.generateAccessToken(token);
        return ResponseEntity.ok(Map.of("newAccessToken", newAccessToken));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getProfile(@RequestAttribute("userEmail") String userEmail) {
        return ResponseEntity.ok(Map.of("email", userEmail));
    }
}
