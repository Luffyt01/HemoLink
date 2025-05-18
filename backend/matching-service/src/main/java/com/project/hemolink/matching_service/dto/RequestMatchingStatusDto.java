package com.project.hemolink.matching_service.dto;

import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RequestMatchingStatusDto {
    private String requestId;
    private RequestStatus status;
    private long totalMatches;
    private long confirmedDonations;
    private int unitsRequired;
    private int unitsFulfilled;
}