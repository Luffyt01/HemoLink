package com.project.hemolink.user_service.entities;

import com.project.hemolink.user_service.entities.enums.BloodType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.geo.Point;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "donors")
public class Donor{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    private User user;
    @Enumerated(EnumType.STRING)
    private BloodType bloodType;
    private Point location;
    private LocalDateTime lastDonation;
    private boolean isAvailable;
}
