package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.enums.HospitalStatus;
import com.project.hemolink.user_service.entities.enums.HospitalType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Year;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompleteHospitalProfileDto {

    @NotBlank(message = "Hospital name is required")
    @Size(min = 3, max = 100, message = "Hospital name must be between 3 and 100 characters")
    private String hospitalName;

    @NotBlank(message = "License number is required")
    @Pattern(regexp = "^[A-Za-z0-9-]{8,20}$",
            message = "License number must be 8-20 alphanumeric characters with optional hyphens")
    private String licenceNumber;

    @NotNull(message = "Service area is required")
    @Valid
    private PointDTO serviceArea;

    @NotBlank(message = "Address is required")
    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    @NotBlank(message = "Emergency phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$",
            message = "Emergency phone must be 10-15 digits with optional country code")
    private String emergencyPhoneNo;

    @Size(max = 150, message = "Website URL cannot exceed 150 characters")
    private String website;


    @Size(max = 50, message = "Working hours cannot exceed 50 characters")
    private String workingHours;

    @NotNull(message = "Hospital status is required")
    private HospitalStatus hospitalStatus;

    @NotNull(message = "Hospital type is required")
    private HospitalType hospitalType;

    @NotNull(message = "Establishment year is required")
    private Year establishmentYear;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
}