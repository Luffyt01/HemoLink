package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.dto.SignupRequestDto;
import com.project.hemolink.user_service.dto.UserDto;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.exception.AuthenticationException;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.exception.UserOperationException;
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

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService  implements UserDetailsService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    /*
     * Function to signup the user
     */
//    @Transactional
    @CachePut(cacheNames = "users", key="#result.id")
    public UserDto signup(SignupRequestDto signupRequestDto) {
        try {
            log.info("Attempting to signup user with email: {}", signupRequestDto.getEmail());

            // Check if the user already exists or not, if present throw exception
            if (userRepository.existsByEmail(signupRequestDto.getEmail())) {
                throw new UserOperationException("User with email " + signupRequestDto.getEmail() + " already exists");
            }

            // Mapping the details entered to the user object
            User toBeCreatedUser = modelMapper.map(signupRequestDto, User.class);
            // Encoding/ encrypting the password to make it more secure
            toBeCreatedUser.setPassword(passwordEncoder.encode(signupRequestDto.getPassword()));

            // Saving the user with encrypted password in db
            User savedUser = userRepository.save(toBeCreatedUser);
            log.info("User registered successfully with email: {}", signupRequestDto.getEmail());

            return modelMapper.map(savedUser, UserDto.class);

        } catch (UserOperationException e) {
            log.error("User operation failed: {}", e.getMessage());
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional(readOnly = true)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials, user not found with email: "+username));

    }


    public User getUserById(String userId){
        return userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));
    }


    public User save(User newUser){
        return userRepository.save(newUser);
    }
}

