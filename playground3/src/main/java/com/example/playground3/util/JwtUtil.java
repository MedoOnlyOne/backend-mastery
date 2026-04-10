package com.example.playground3.util;

import com.example.playground3.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

public class JwtUtil {

    private static final String ACCESS_SECRET = "OLJIGYIFVTCHVJHVJKBJJDSPRINGBOOTPAD";
    private static final String REFRESH_SECRET = "HBVKBGUOHONGVJVLVHIKLSPRINGBOOTPAD";
    private static final long ACCESS_EXPIRATION_MS = 60 * 1000;       // 1 minute
    private static final long REFRESH_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

    private static SecretKey getAccessKey() {
        return Keys.hmacShaKeyFor(ACCESS_SECRET.getBytes());
    }

    private static SecretKey getRefreshKey() {
        return Keys.hmacShaKeyFor(REFRESH_SECRET.getBytes());
    }

    public static String createAccessToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_MS))
                .signWith(getAccessKey())
                .compact();
    }

    public static String createRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_MS))
                .signWith(getRefreshKey())
                .compact();
    }

    public static Claims verifyAccessToken(String token) {
        return Jwts.parser()
                .verifyWith(getAccessKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public static Claims verifyRefreshToken(String token) {
        return Jwts.parser()
                .verifyWith(getRefreshKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
