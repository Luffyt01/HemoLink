package com.project.hemolink.matching_service.dto;

import com.project.hemolink.matching_service.entities.enums.BloodType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DonorMatchDto {

    private String donorId;
    private String donorName;
    private BloodType bloodType;
    private double score;
    private double distanceKm;
}
