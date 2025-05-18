package com.project.hemolink.matching_service.dto;

import com.project.hemolink.matching_service.entities.enums.NotificationStatus;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import com.project.hemolink.matching_service.entities.enums.BloodType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DonorMatchHistoryDto {
    private String matchId;
    private String requestId;
    private BloodType bloodType;
    private UrgencyLevel urgency;
    private LocalDateTime matchedAt;
    private NotificationStatus status;
    private String hospitalName;
}