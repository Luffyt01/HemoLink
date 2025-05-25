package com.project.hemolink.user_service.repositories;

import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.BloodType;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DonorRepository extends JpaRepository<Donor, UUID> {

    @Query(value = """
        SELECT d FROM Donor d 
        WHERE d.user = :user
        AND d.bloodType = :bloodType 
        AND d.isAvailable = true
        AND FUNCTION('ST_DWithin', d.location, :point, :radius) = true
        
        ORDER BY FUNCTION('ST_Distance', d.location, :point)
        """)
    List<Donor> findNearbyEligibleDonors(
            @Param("user") User user,
            @Param("point") Point point,
            @Param("bloodType") BloodType bloodType,
            @Param("radius") double radius
//            @Param("minLastDonation") LocalDate minLastDonation, AND (d.lastDonation IS NULL OR d.lastDonation < :minLastDonation)
            );




    Optional<Donor> findByUser(User user);

    void deleteByUser(User user);
}
