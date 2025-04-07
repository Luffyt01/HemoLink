package com.project.hemolink.user_service.entities;


import com.project.hemolink.user_service.entities.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.Point;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Hospital{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String hospitalName;

    @OneToOne
    private User user;

    private String licenceNumber;

    @Column(columnDefinition = "Geometry(Point, 4326)")
    private Point serviceArea;


    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;
}
