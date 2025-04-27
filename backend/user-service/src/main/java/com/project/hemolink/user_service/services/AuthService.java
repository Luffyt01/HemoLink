package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.dto.LoginRequestDto;
import com.project.hemolink.user_service.dto.LoginResponseDto;
import com.project.hemolink.user_service.dto.SignupRequestDto;
import com.project.hemolink.user_service.dto.UserDto;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.repositories.UserRepository;
import com.project.hemolink.user_service.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.lang.module.ResolutionException;
import java.util.UUID;

/*
 * Service class to setup the authentication logic
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;




    /*
     * Function to Login the user
     */
    public LoginResponseDto login(LoginRequestDto loginRequestDto){
        log.info("Attempting to login user with email: {}", loginRequestDto.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
        );

        log.info("AUTHENTICATED: {}", authentication.isAuthenticated());
        log.info("USERNAME: {}", authentication.getName());

//        User user = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: "+authentication.getName()));

        User user = (User) authentication.getPrincipal();

        String accessToken = jwtService.generateAccessToken(user);

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        loginResponseDto.setId(user.getId().toString());
        loginResponseDto.setAccessToken(accessToken);
        loginResponseDto.setEmail(loginRequestDto.getEmail());
        loginResponseDto.setRole(user.getRole());
        loginResponseDto.setProfileComplete(user.isProfileComplete());
        return loginResponseDto;
    }




}
