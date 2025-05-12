package com.project.hemolink.user_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String, String> redisTemplate;

    // Function to blacklist the tokens
    public void blacklistToken (String token, long expiresInSeconds){
        redisTemplate.opsForValue().set(
                "blacklist:"+token,
                "logged_out",
                expiresInSeconds,
                TimeUnit.SECONDS
        );
    }

    public boolean isTokenBlacklisted(String token){
        return redisTemplate.hasKey("blacklist:" + token);
    }
}
