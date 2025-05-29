package com.project.hemolink.matching_service.entities;

import com.project.hemolink.matching_service.entities.enums.BloodType;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "blood_requests",
    indexes = @Index(name = "idx_expiry_status",
                     columnList = "expiry_time, status"))
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "request_id")
    private UUID id;

    private String hospitalId;
    private String hospitalName;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private int unitsRequired;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgency;
    private Point location;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime expiryTime;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;
}
