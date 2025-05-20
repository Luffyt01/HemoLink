package com.project.hemolink.matching_service.entities;

import com.project.hemolink.matching_service.entities.enums.NotificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "match_log")
public class MatchLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String requestId;
    private String donorId;
    private LocalDateTime matchedAt;
    private NotificationStatus status;
    private boolean volunteered;

}
