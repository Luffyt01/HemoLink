package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.dto.SignupRequestDto;
import com.project.hemolink.user_service.dto.UserDto;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.exception.*;
import com.project.hemolink.user_service.repositories.UserRepository;
import com.project.hemolink.user_service.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service handling user operations including:
 * - User registration
 * - User authentication
 * - User data retrieval
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers new user
     * @param signupRequestDto Contains user registration details
     * @return Created user DTO
     * @throws UserOperationException If user already exists
     */
    @CachePut(cacheNames = "users", key="#result.id")
    public UserDto signup(SignupRequestDto signupRequestDto) {
        try {
            log.info("Attempting to signup user with email: {}", signupRequestDto.getEmail());

            if (userRepository.existsByEmail(signupRequestDto.getEmail())) {
                throw new UserOperationException("User with email " + signupRequestDto.getEmail() + " already exists");
            }

            User toBeCreatedUser = modelMapper.map(signupRequestDto, User.class);
            toBeCreatedUser.setPassword(passwordEncoder.encode(signupRequestDto.getPassword()));

            User savedUser = userRepository.save(toBeCreatedUser);
            log.info("User registered successfully with email: {}", signupRequestDto.getEmail());
            return modelMapper.map(savedUser, UserDto.class);

        } catch (UserOperationException e) {
            log.error("User operation failed: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Finds user by email
     * @param email User's email
     * @return User entity
     */
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    /**
     * Loads user by username (email) for Spring Security
     * @param username User's email
     * @return UserDetails
     * @throws UsernameNotFoundException If user not found
     */
    @Transactional(readOnly = true)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials, user not found with email: "+username));
    }

    /**
     * Finds user by ID
     * @param userId User's unique ID
     * @return User entity
     */
    public User getUserById(String userId) {
        return userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));
    }

    /**
     * Saves user entity
     * @param newUser User entity to save
     * @return Saved user entity
     */
    public User save(User newUser) {
        return userRepository.save(newUser);
    }
}