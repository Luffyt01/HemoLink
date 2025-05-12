package com.project.hemolink.user_service.controller;

import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.services.AuthService;
import com.project.hemolink.user_service.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
 * Controller class to handle the authentication logic
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    // Function to Sign up the user

    @PostMapping("/signup")
    public ResponseEntity<UserDto> signup(@Valid @RequestBody SignupRequestDto signupRequestDto){
        UserDto userDto = userService.signup(signupRequestDto);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

    // Function to Login the user
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto){

        return ResponseEntity.ok(authService.login(loginRequestDto));
    }

    // Function to logout the user
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request){
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

//    @PostMapping("/refresh-token")
//    public ResponseEntity<LoginResponseDto> refreshToken(
//            @RequestBody RefreshTokenRequest refreshTokenRequest) {
//        return ResponseEntity.ok(authService.refreshToken(refreshTokenRequest));
//    }

    // Forgot password
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(
            @RequestParam String email) {
        authService.initiatePasswordReset(email);
        return ResponseEntity.accepted().build();
    }

    // Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @RequestBody ResetPasswordRequest resetPasswordRequest) {
        authService.completePasswordReset(resetPasswordRequest);
        return ResponseEntity.ok().build();
    }
}
