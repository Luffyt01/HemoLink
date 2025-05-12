package com.project.hemolink.user_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangePasswordDto {
    private String currentPassword;
    private String newPassword;
}
