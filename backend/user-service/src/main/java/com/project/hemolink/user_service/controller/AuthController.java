package com.project.hemolink.user_service.controller;

import com.project.hemolink.user_service.dto.LoginRequestDto;
import com.project.hemolink.user_service.dto.SignupRequestDto;
import com.project.hemolink.user_service.dto.UserDto;
import com.project.hemolink.user_service.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 * Controller class to handle the authentication logic
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // Function to Sign up the user

    @PostMapping("/signup")
    public ResponseEntity<UserDto> signup(@Valid @RequestBody SignupRequestDto signupRequestDto){
        UserDto userDto = authService.signup(signupRequestDto);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

    // Function to Login the user
    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDto loginRequestDto){
        String token = authService.login(loginRequestDto);

        return ResponseEntity.ok(token);
    }

    // TODO implement refresh token and logout feature
}
