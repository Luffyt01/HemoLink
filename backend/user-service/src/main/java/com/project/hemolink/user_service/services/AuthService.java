package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.dto.LoginRequestDto;
import com.project.hemolink.user_service.dto.LoginResponseDto;
import com.project.hemolink.user_service.dto.SignupRequestDto;
import com.project.hemolink.user_service.dto.UserDto;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    @Transactional
    public void logout(HttpServletRequest request) {
        try {
            final String requestTokenHeader = request.getHeader("Authorization");
            if (requestTokenHeader == null || !requestTokenHeader.startsWith("Bearer")) {
                throw new InvalidTokenException("Authorization header is missing or invalid");
            }

            String token = requestTokenHeader.split("Bearer ")[1];
            jwtService.expireTokenImmediately(token);
            log.info("User logged out successfully");

        } catch (InvalidTokenException e) {
            log.error("Invalid token during logout", e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during logout", e);
            throw new AuthenticationException("Logout failed due to unexpected error");
        }
    }
}
