package com.project.hemolink.matching_service.dto;

import com.project.hemolink.matching_service.entities.enums.BloodType;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestDto {
    private String id;
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
