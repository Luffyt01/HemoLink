package com.project.hemolink.matching_service.entities;

import com.project.hemolink.matching_service.entities.enums.DonationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String donorId;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private BloodRequest request;

    private LocalDateTime localDateTime;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;
}
