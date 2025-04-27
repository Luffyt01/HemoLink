package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String id;
    private String email;
    private boolean profileComplete;
    private UserRole role;
    private String accessToken;
}
