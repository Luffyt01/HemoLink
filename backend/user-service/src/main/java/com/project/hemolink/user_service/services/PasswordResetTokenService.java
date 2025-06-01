package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.entities.PasswordResetToken;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.repositories.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Service handling password reset token operations including:
 * - Token generation
 * - Token validation
 * - Token management
 */
@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    /**
     * Creates password reset token for user
     * @param user User entity
     * @param token Generated token string
     * @throws BadRequestException If valid token already exists
     */
    public void createPasswordResetToken(User user, String token) {
        PasswordResetToken existingToken = passwordResetTokenRepository.findByUser(user).orElse(null);

        if (existingToken != null) {
            if (existingToken.getExpiryDate().before(new Date())) {
                deleteToken(existingToken);
            } else {
                throw new BadRequestException("Password reset link is already sent to your email: "+user.getEmail());
            }
        }

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiryDate(new Date(System.currentTimeMillis() + (1000L * 60 * 60))) // 1 hour validity
                .build();

        passwordResetTokenRepository.save(resetToken);
    }

    /**
     * Validates password reset token
     * @param token Token string to validate
     * @return Valid token entity
     * @throws BadRequestException If token is invalid or expired
     */
    public PasswordResetToken validatePasswordToken(String token) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid token"));

        if (passwordResetToken.getExpiryDate().before(new Date())) {
            throw new BadRequestException("Expired token");
        }
        return passwordResetToken;
    }

    /**
     * Deletes password reset token
     * @param token Token entity to delete
     */
    public void deleteToken(PasswordResetToken token) {
        passwordResetTokenRepository.delete(token);
    }
}