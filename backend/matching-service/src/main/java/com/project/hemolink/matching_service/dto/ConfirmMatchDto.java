package com.project.hemolink.matching_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ConfirmMatchDto {

    private String requestId;
    private String donorId;
    private LocalDateTime scheduledTime;
}

