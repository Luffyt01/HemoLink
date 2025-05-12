package com.project.hemolink.matching_service.dto;


import com.project.hemolink.matching_service.entities.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private UUID id;
    private String email;
    private String phone;
    private UserRole role;
    private LocalDateTime createdAt;
    private boolean isProfileComplete;
}
