package com.project.hemolink.user_service.entities;


import com.project.hemolink.user_service.entities.enums.HospitalStatus;
import com.project.hemolink.user_service.entities.enums.HospitalType;
import com.project.hemolink.user_service.entities.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.time.Year;
import java.util.UUID;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Hospital{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String hospitalName;

    @OneToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private HospitalType hospitalType;
    private Year establishmentYear;

    private String mainPhoneNo;
    private String emergencyPhoneNo;
    private String website;
    private String workingHours;

    @Enumerated(EnumType.STRING)
    private HospitalStatus hospitalStatus;
    private String licenceNumber;

    @Column(columnDefinition = "Geometry(Point, 4326)")
    private Point serviceArea;
    private String address;

    private String description;
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;
}
