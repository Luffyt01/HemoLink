package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.HospitalStatus;
import com.project.hemolink.user_service.entities.enums.HospitalType;
import com.project.hemolink.user_service.entities.enums.VerificationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.awt.*;
import java.time.Year;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HospitalDto {
    private String id;
    private String hospitalName;
    private UserDto user;
    private HospitalType hospitalType;
    private Year establishmentYear;
    private String mainPhoneNo;
    private String emergencyPhoneNo;
    private String website;
    private String workingHours;
    private HospitalStatus hospitalStatus;
    private String licenceNumber;
    private PointDTO serviceArea;
    private String address;
    private String description;
    private VerificationStatus verificationStatus;
}
