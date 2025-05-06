package com.project.hemolink.user_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.hemolink.user_service.entities.enums.BloodType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompleteDonorProfileDto {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name can only contain letters and spaces")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Donor must be at least 18 years old")
    @Max(value = 65, message = "Donor must be at most 65 years old")
    private Integer age;


    private String emergencyContact;

    @NotBlank(message = "Address is required")
    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    @NotNull(message = "Blood type is required")
    private BloodType bloodType;

    @NotNull(message = "Location is required")
    @Valid
    private PointDTO location;

    @NotNull(message = "Availability status is required")
    @JsonProperty("isAvailable")
    private Boolean isAvailable;
}