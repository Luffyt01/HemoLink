package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.User;

import com.project.hemolink.user_service.entities.enums.BloodType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.geo.Point;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DonorDto {
    private UserDto user;
    private BloodType bloodType;
    private PointDTO location;
    private LocalDateTime lastDonation;
    private boolean isAvailable;

}
