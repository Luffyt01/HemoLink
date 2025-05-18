package com.project.hemolink.matching_service.dto;

import com.project.hemolink.matching_service.entities.enums.NotificationStatus;
import com.project.hemolink.matching_service.entities.enums.BloodType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RequestMatchSummaryDto {
    private String matchId;
    private String donorId;
    private String donorName;
    private BloodType bloodType;
    private NotificationStatus status;
    private double distanceKm;
}