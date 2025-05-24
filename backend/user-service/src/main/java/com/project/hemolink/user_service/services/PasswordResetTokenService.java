package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.entities.PasswordResetToken;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.repositories.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    /*
     * Function to create a password reset token for user identification and verification
     */
    public void createPasswordResetToken(User user, String token){
        // Checking if and unused token for the user is present in repository or not
        PasswordResetToken existingToken = passwordResetTokenRepository.findByUser(user).orElse(null);

        // check if the token is present or not
        if (existingToken != null){
            // Delete the token if present but expired
            if (existingToken.getExpiryDate().before(new Date())){
                deleteToken(existingToken);
            }else{
                // Throws exception if the token is present but not used by user
                throw new BadRequestException("Password reset link is already sent to your email: "+user.getEmail());
            }
        }

        // Generation password resetting token
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiryDate(new Date(System.currentTimeMillis() + (1000L * 60 * 60)))
                .build();

        // Saving the details in the repository
        passwordResetTokenRepository.save(resetToken);
    }

    /*
     * Function to validate if the token is valid or invalid
     */
    public PasswordResetToken validatePasswordToken(String token){

        // Throws exception if the token is not present in the repository
        PasswordResetToken passwordResetToken =  passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid token"));

        // Throws exception if the token is expired
        if (passwordResetToken.getExpiryDate().before(new Date())){
            throw new BadRequestException("Expired token");
        }
        return passwordResetToken;
    }

    // Function to delete the password reset token
    public void deleteToken(PasswordResetToken token){
        passwordResetTokenRepository.delete(token);
    }

}
