package com.project.hemolink.user_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Service handling JWT token blacklisting operations
 */
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    private final RedisTemplate<String, String> redisTemplate;

    /**
     * Blacklists a JWT token
     * @param token Token to blacklist
     * @param expiresInSeconds Time until token expires (in seconds)
     */
    public void blacklistToken(String token, long expiresInSeconds) {
        redisTemplate.opsForValue().set(
                "blacklist:"+token,
                "logged_out",
                expiresInSeconds,
                TimeUnit.SECONDS
        );
    }

    /**
     * Checks if token is blacklisted
     * @param token Token to check
     * @return True if token is blacklisted, false otherwise
     */
    public boolean isTokenBlacklisted(String token) {
        return redisTemplate.hasKey("blacklist:" + token);
    }
}