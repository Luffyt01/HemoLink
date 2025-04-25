package com.project.hemolink.matching_service.dto;


import com.project.hemolink.matching_service.entities.enums.BloodType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DonorDto {
    private String id;
    private String name;
    private Integer age;
    private String address;
    private UserDto user;
    private BloodType bloodType;
    private PointDTO location;
    private LocalDateTime lastDonation;
    private boolean isAvailable;

}
