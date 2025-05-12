package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponseDto {
    private String id;
    private String email;
    private String phoneNo;
    private boolean profileComplete;
    private UserRole role;
    private String accessToken;
    private HttpStatus statusCode;
}
