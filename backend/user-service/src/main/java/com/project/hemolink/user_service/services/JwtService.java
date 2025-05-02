package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secretKey}")
    private String jwtSecretKey;

    private SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user){
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email",user.getEmail())
                .claim("role",user.getRole().toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() * 1000L * 60 * 60 * 24 * 7)) // 7 days
                .signWith(getSecretKey())
                .compact();
    }

    public String expireTokenImmediately(String token){
        Claims claims = parseTokenClaims(token);

        return Jwts.builder()
                .subject(claims.getSubject())
                .claims(claims)
                .issuedAt(claims.getIssuedAt())
                .expiration(new Date())
                .signWith(getSecretKey())
                .compact();
    }

    public Claims parseTokenClaims(String token){
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String generateRefreshToken(User user){
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuedAt(new Date())
                .signWith(getSecretKey())
                .compact();
    }




    public String getUserIdFromToken(String token){

        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("role", String.class); // Extract role claim
    }
}
