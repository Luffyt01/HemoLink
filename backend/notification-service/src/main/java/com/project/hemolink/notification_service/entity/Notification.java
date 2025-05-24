package com.project.hemolink.notification_service.entity;


import com.project.hemolink.notification_service.entity.enums.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private UUID userId;
    private String message;
    private boolean read;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @CreationTimestamp
    private LocalDateTime createdAt;
}