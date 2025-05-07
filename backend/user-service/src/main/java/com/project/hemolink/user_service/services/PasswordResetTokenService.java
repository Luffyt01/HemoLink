package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.entities.PasswordResetToken;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.repositories.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetToken createPasswordResetToken(User user, String token){
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiryDate(new Date(System.currentTimeMillis() + (1000L * 60 * 60)))
                .build();
        return passwordResetTokenRepository.save(resetToken);
    }

    public PasswordResetToken validatePasswordToken(String token){
        return passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired token"));

    }

}
