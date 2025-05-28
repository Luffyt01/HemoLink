package com.project.hemolink.matching_service.dto;


import com.project.hemolink.matching_service.entities.enums.BloodType;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateRequestDto {

    private BloodType bloodType;
    private int unitsRequired;
    private UrgencyLevel urgency;
    private LocalDateTime expiryTime;
}
