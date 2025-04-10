package com.project.hemolink.matching_service.dto;

import com.project.hemolink.matching_service.entities.enums.DonationStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class DonationDto {

    private String donationId;
    private String requestId;
    private String donorId;
    private LocalDateTime scheduledTime;
    private DonationStatus status;
}
