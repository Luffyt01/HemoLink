package com.project.hemolink.matching_service.dto;

import com.project.hemolink.matching_service.entities.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
