package com.project.hemolink.matching_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VolunteerResponseDto {
    private String matchId;
    private String requestId;
    private String donorId;
    private String status;
}