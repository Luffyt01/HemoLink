package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.entities.PasswordResetToken;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.exception.AuthenticationException;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.exception.InvalidTokenException;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.repositories.UserRepository;
import com.project.hemolink.user_service.utils.PasswordUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.lang.module.ResolutionException;
import java.util.UUID;

/*
 * Service class to setup the authentication logic
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService blacklistService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender javaMailSender;
    private final PasswordResetTokenService passwordResetTokenService;





    /*
     * Function to Login the user
     */
    @Transactional
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        try {
            log.info("Attempting to login user with email: {}", loginRequestDto.getEmail());

            // Authenticating the user and verifying the details
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
            );

            // Throws exception if the user is not authenticated
            if (!authentication.isAuthenticated()) {
                throw new AuthenticationException("Authentication failed for user: " + loginRequestDto.getEmail());
            }

            // Fetching the authenticated user
            User user = (User) authentication.getPrincipal();

            // Generating the JWT token for the authenticated user
            String accessToken = jwtService.generateAccessToken(user);

            // Build the response
            return LoginResponseDto.builder()
                    .id(user.getId().toString())
                    .accessToken(accessToken)
                    .email(loginRequestDto.getEmail())
                    .role(user.getRole())
                    .profileComplete(user.isProfileComplete())
                    .phoneNo(user.getPhone())
                    .statusCode(HttpStatus.OK)
                    .build();

        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", loginRequestDto.getEmail());
            throw new AuthenticationException("Invalid email or password");
        }
    }

    /*
     * Function to logout the user
     */
    @Transactional
    public void logout(HttpServletRequest request) {
        try {
            // Fetching the authorization token from the request header
            final String requestTokenHeader = request.getHeader("Authorization");

            // Throws exception if the header is empty or incorrect
            if (requestTokenHeader == null || !requestTokenHeader.startsWith("Bearer")) {
                throw new InvalidTokenException("Authorization header is missing or invalid");
            }

            // Got correct JWT token
            String token = requestTokenHeader.split("Bearer ")[1];

            // Blacklisting the token
            blacklistService.blacklistToken(token, jwtService.getRemainingValidity(token));
            log.info("User logged out successfully");

        } catch (InvalidTokenException e) {
            log.error("Invalid token during logout", e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during logout", e);
            throw new AuthenticationException("Logout failed due to unexpected error");
        }
    }

    public String refreshToken(String refreshToken) {
        return null;
    }

    /*
     * Function to start the process for user password reset
     */
    public void initiatePasswordReset(String email) {
        log.info("Resetting password for user with email: {}", email);

        // Throws exception if the user is not present with the entered email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: "+email));

        // Generating a random token
        String token = UUID.randomUUID().toString();

        // Creating a password token for user identification
        passwordResetTokenService.createPasswordResetToken(user,token);

        // Sending email to the user with the password reset link and the token
        sendPasswordResetEmail(user.getEmail(), token);

    }

    /*
     * Function to send email to user containing the password reset link and the token
     */
    private void sendPasswordResetEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click link below: \n\n" +
                "https://hemo-link-iota.vercel.app/reset-password?email="+email+"&"+"token="+token);
        javaMailSender.send(message);
    }


    /*
     * Function to reset the password
     */
    @Transactional
    public void completePasswordReset(ResetPasswordRequest resetPasswordRequest) {
        // Verify if the token is valid or invalid
        PasswordResetToken token = passwordResetTokenService.validatePasswordToken(resetPasswordRequest.getToken());
        // Getting user from token
        User user = token.getUser();
        // Setting new password
        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
        // Saving the new password for the user
        userRepository.save(user);
        // Delete the token after the password has been successfully changed
        passwordResetTokenService.deleteToken(token);
    }
}
