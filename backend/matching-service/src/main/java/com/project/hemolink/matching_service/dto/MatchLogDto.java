package com.project.hemolink.matching_service.dto;

import com.project.hemolink.matching_service.entities.enums.NotificationStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class MatchLogDto {
    private UUID id;
    private String requestId;
    private String donorId;
    private LocalDateTime matchedAt;
    private NotificationStatus status;
}
