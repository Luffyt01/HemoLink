package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private String id;
    private String email;
    private String phone;
    private UserRole role;
    private LocalDateTime createdAt;
}
