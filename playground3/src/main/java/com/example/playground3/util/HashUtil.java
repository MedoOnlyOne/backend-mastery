package com.example.playground3.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashUtil {

    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public static String hashPassword(String password) {
        return encoder.encode(password);
    }

    public static boolean comparePassword(String password, String hashedPassword) {
        return encoder.matches(password, hashedPassword);
    }
}
