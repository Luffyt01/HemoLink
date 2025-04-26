package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.VerificationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.awt.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HospitalDto {
    private String id;
    private String hospitalName;
    private UserDto user;
    private String licenceNumber;
    private PointDTO serviceArea;
    private VerificationStatus verificationStatus;
}
