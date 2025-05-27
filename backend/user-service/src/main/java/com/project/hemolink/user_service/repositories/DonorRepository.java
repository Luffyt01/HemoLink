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

public interface DonorRepository extends JpaRepository<Donor, UUID> {

    @Query(value = """
    SELECT d FROM Donor d 
    WHERE d.bloodType IN :compatibleTypes 
    AND d.isAvailable = true
    AND (d.lastDonation IS NULL OR d.lastDonation <= :minDate)
    AND FUNCTION('ST_DistanceSphere', d.location, :point) <= :radius
    ORDER BY FUNCTION('ST_DistanceSphere', d.location, :point)
    """)
    List<Donor> findNearbyEligibleDonors(
            @Param("point") Point point,
            @Param("compatibleTypes") List<BloodType> compatibleTypes,
            @Param("radius") double radius,
            @Param("minDate") LocalDate minDate,
            Pageable pageable);


    @Query(value = """
        SELECT d FROM Donor d 
        WHERE d.user.id = :userId
        """)
    Optional<Donor> findByUserId(@Param("userId") UUID userId);

    Optional<Donor> findByUser(User user);

    void deleteByUser(User user);
}
