package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.enums.BloodType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DonorMatchDto {

    private UUID id;
    private String name;
    private BloodType bloodType;
    private double score;
    private double distanceKm;
    private LocalDate lastDonationDate;
    private boolean isAvailable;
}
