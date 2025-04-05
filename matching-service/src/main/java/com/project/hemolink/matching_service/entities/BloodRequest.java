package com.project.hemolink.matching_service.entities;

import com.project.hemolink.matching_service.entities.enums.BloodType;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "blood_requests")
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private int unitsRequired;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgency;

    private LocalDateTime expiryTime;

    @OneToMany(mappedBy = "request")
    private List<Donation> matchedDonations;
}
