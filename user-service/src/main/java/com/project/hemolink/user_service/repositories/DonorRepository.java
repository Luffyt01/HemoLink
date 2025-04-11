package com.project.hemolink.user_service.repositories;

import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.BloodType;
import org.locationtech.jts.geom.Point;
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

    @Query("SELECT d FROM Donor d WHERE " +
            "d.bloodType = :bloodType AND " +
            "d.isAvailable = true AND " +
            "ST_DWithinn(d.location, : location, 50) = true AND " +
            "(d.lastDonation IS NULL OR d.lastDonation < :minDate)")
    List<Donor> findEligibleDonors(@Param("bloodType") BloodType bloodType,
                                   @Param("location") Point location,
                                   @Param("minDate")LocalDate minDate);



    Optional<Donor> findByUser(User user);

    void deleteByUser(User user);
}
