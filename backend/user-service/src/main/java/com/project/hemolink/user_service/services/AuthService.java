package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.entities.PasswordResetToken;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.exception.*;
import com.project.hemolink.user_service.repositories.UserRepository;
import com.project.hemolink.user_service.utils.PasswordUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service handling authentication-related operations including:
 * - User login/logout
 * - Password reset functionality
 * - JWT token management
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

    /**
     * Authenticates user and generates JWT token
     * @param loginRequestDto Contains email and password
     * @return LoginResponseDto with user details and access token
     * @throws AuthenticationException If credentials are invalid
     */
    @Transactional
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        try {
            log.info("Attempting to login user with email: {}", loginRequestDto.getEmail());

            // Authenticate user credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDto.getEmail(),
                            loginRequestDto.getPassword()
                    )
            );

            if (!authentication.isAuthenticated()) {
                throw new AuthenticationException("Authentication failed for user: " + loginRequestDto.getEmail());
            }

            User user = (User) authentication.getPrincipal();
            String accessToken = jwtService.generateAccessToken(user);

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

    /**
     * Logs out user by blacklisting their JWT token
     * @param request HTTP request containing the authorization header
     * @throws InvalidTokenException If token is missing or invalid
     */
    @Transactional
    public void logout(HttpServletRequest request) {
        try {
            final String requestTokenHeader = request.getHeader("Authorization");

            if (requestTokenHeader == null || !requestTokenHeader.startsWith("Bearer")) {
                throw new InvalidTokenException("Authorization header is missing or invalid");
            }

            String token = requestTokenHeader.split("Bearer ")[1];
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

    /**
     * Initiates password reset process by generating token and sending email
     * @param email User's email address
     * @throws ResourceNotFoundException If user not found
     */
    public void initiatePasswordReset(String email) {
        log.info("Resetting password for user with email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: "+email));

        String token = UUID.randomUUID().toString();
        passwordResetTokenService.createPasswordResetToken(user,token);
        sendPasswordResetEmail(user.getEmail(), token);
    }

    /**
     * Sends password reset email to user
     * @param email Recipient email
     * @param token Unique reset token
     */
    private void sendPasswordResetEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click link below: \n\n" +
                "https://hemo-link-iota.vercel.app/reset-password?email="+email+"&"+"token="+token);
        javaMailSender.send(message);
    }

    /**
     * Completes password reset process
     * @param resetPasswordRequest Contains token and new password
     * @throws BadRequestException If token is invalid or expired
     */
    @Transactional
    public void completePasswordReset(ResetPasswordRequest resetPasswordRequest) {
        PasswordResetToken token = passwordResetTokenService.validatePasswordToken(resetPasswordRequest.getToken());
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
        userRepository.save(user);
        passwordResetTokenService.deleteToken(token);
    }
}