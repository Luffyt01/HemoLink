package com.project.hemolink.matching_service.repositories;

import com.project.hemolink.matching_service.entities.Donation;
import com.project.hemolink.matching_service.entities.enums.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationRepository extends JpaRepository<Donation, UUID> {

    List<Donation> findByDonorIdAndStatus(String donorId, DonationStatus status);

    @Query("SELECT d FROM Donation d WHERE d.request.id = :requestId AND d.status = 'COMPLETED'")
    List<Donation> findCompletedDonationsForRequest(@Param("requestId") String requestId);

    long countByRequestIdAndStatus(UUID id, DonationStatus donationStatus);

    List<Donation> findByDonorId(String donorId);
}
