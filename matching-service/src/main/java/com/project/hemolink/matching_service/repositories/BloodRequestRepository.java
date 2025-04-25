package com.project.hemolink.matching_service.repositories;

import com.project.hemolink.matching_service.entities.BloodRequest;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, UUID> {

    Page<BloodRequest> findByHospitalId(String hospitalId, Pageable pageRequest);

    boolean existsByHospitalId(String hospitalId);

    List<BloodRequest> findByStatusAndExpiryTimeBefore(RequestStatus requestStatus, LocalDateTime now);

    @Query("SELECT r FROM BloodRequest  r WHERE r.status = 'ACTIVE' AND r.urgency = 'HIGH' ")
    List<BloodRequest> findUrgentRequests();
}
