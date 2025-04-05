package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.dto.LoginRequestDto;
import com.project.hemolink.user_service.dto.SignupRequestDto;
import com.project.hemolink.user_service.dto.UserDto;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.repositories.UserRepository;
import com.project.hemolink.user_service.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.lang.module.ResolutionException;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;


    public UserDto signup(SignupRequestDto signupRequestDto) {
        log.info("Attempting to signup the user with email: {}", signupRequestDto.getEmail());

        boolean userExists = userRepository.existsByEmail(signupRequestDto.getEmail());

        if (userExists){
            throw new BadRequestException("User already exists, cannot signup again");
        }

        User user = modelMapper.map(signupRequestDto, User.class);

        user.setPassword(PasswordUtil.hashPassword(signupRequestDto.getPassword()));

        User savedUser = userRepository.save(user);

        return modelMapper.map(savedUser, UserDto.class);
    }

    public String login(LoginRequestDto loginRequestDto){
        log.info("Attempting to login user with email: {}", loginRequestDto.getEmail());

        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new ResolutionException("User not found with email: "+loginRequestDto.getEmail()));

        boolean isPasswordMatch = PasswordUtil.checkPassword(loginRequestDto.getPassword(), user.getPassword());

        if (!isPasswordMatch){
            throw new BadRequestException("Incorrect password");
        }

        return jwtService.generateAccessToken(user);
    }
}
