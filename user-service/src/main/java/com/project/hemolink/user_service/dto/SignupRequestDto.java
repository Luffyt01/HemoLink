package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestDto {

    private String email;
    private String phone;
    private String password;
    private UserRole role;
}
