package com.project.hemolink.matching_service.dto;

import com.project.hemolink.matching_service.entities.enums.DonationStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DonationStatusDto {
    private String donationId;
    private DonationStatus newStatus;
}
