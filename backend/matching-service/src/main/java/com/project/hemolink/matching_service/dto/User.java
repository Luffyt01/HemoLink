package com.project.hemolink.matching_service.dto;


import com.project.hemolink.matching_service.entities.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_id")
    private UUID id;  // Matches ID from User Service

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private UserRole role;  // DONOR, HOSPITAL, etc.

    // Other fields (if needed)
    private String name;
    private String phone;
}