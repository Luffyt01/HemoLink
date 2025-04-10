package com.project.hemolink.user_service.entities;

import com.project.hemolink.user_service.entities.enums.BloodType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

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
    private String name;
    private Integer age;
    private String address;

    @OneToOne
    private User user;
    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    @Column(columnDefinition = "Geometry(Point, 4326)")
    private Point location;
    private LocalDateTime lastDonation;
    private boolean isAvailable;
}
