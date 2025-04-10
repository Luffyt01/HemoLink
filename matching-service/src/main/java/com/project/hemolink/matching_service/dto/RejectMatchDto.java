package com.project.hemolink.matching_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RejectMatchDto {

    private String matchId;
    private String reason;
}
