package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Calendar;
import java.util.Date;

/**
 * Service handling JWT token operations including:
 * - Token generation
 * - Token validation
 * - Token claims extraction
 */
@Service
@RequiredArgsConstructor
public class JwtService {
    @Value("${jwt.secretKey}")
    private String jwtSecretKey;
    private final TokenBlacklistService blacklistService;

    /**
     * Generates secret key from configured secret string
     */
    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates JWT access token for user
     * @param user User entity
     * @return JWT token string
     */
    public String generateAccessToken(User user) {
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_YEAR, 7); // 7 day validity
        Date expirationDate = calendar.getTime();

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().toString())
                .issuedAt(currentDate)
                .expiration(expirationDate)
                .signWith(getSecretKey())
                .compact();
    }

    /**
     * Calculates remaining validity of token in seconds
     * @param token JWT token
     * @return Remaining validity in seconds
     */
    public long getRemainingValidity(String token) {
        Claims claims = parseTokenClaims(token);
        Date expiration = claims.getExpiration();
        return (expiration.getTime() - System.currentTimeMillis()) / 1000;
    }

    /**
     * Parses and validates JWT token claims
     * @param token JWT token
     * @return Token claims
     */
    public Claims parseTokenClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Generates refresh token for user
     * @param user User entity
     * @return Refresh token string
     */
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuedAt(new Date())
                .signWith(getSecretKey())
                .compact();
    }

    /**
     * Extracts user ID from token
     * @param token JWT token
     * @return User ID as string
     */
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    /**
     * Extracts user role from token
     * @param token JWT token
     * @return User role as string
     */
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("role", String.class);
    }
}