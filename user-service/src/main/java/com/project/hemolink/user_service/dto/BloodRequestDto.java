package com.project.hemolink.user_service.dto;


import com.project.hemolink.user_service.entities.enums.BloodType;
import com.project.hemolink.user_service.entities.enums.RequestStatus;
import com.project.hemolink.user_service.entities.enums.UrgencyLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestDto {
    private UUID id;
    private String hospitalId;
    private String hospitalName;
    private BloodType bloodType;
    private int unitsRequired;
    private UrgencyLevel urgency;
    private PointDTO location;
    private LocalDateTime createdAt;
    private LocalDateTime expiryTime;
    private RequestStatus status;
}
