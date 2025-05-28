package com.project.hemolink.matching_service.services;

import com.project.hemolink.matching_service.auth.UserContextHolder;
import com.project.hemolink.matching_service.client.UserServiceClient;
import com.project.hemolink.matching_service.dto.*;
import com.project.hemolink.matching_service.entities.BloodRequest;
import com.project.hemolink.matching_service.entities.enums.BloodType;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import com.project.hemolink.matching_service.exception.BadRequestException;
import com.project.hemolink.matching_service.exception.ResourceNotFoundException;
import com.project.hemolink.matching_service.repositories.BloodRequestRepository;
import com.project.hemolink.matching_service.security.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service for handling blood request operations including creation, updates, and queries
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class BloodRequestService {
    private final BloodRequestRepository bloodRequestRepository;
    private final ModelMapper modelMapper;
    private final UserServiceClient userServiceClient;
    private final SecurityUtil securityUtil;

    /**
     * Creates a new blood request from DTO
     * @param createRequestDto Request details
     * @return Created request DTO
     */
    @Transactional
    public BloodRequestDto createBloodRequest(CreateRequestDto createRequestDto) {
        UUID userId = securityUtil.getCurrentUserId();

        // Verify hospital exists
        HospitalDto hospitalDto = userServiceClient.getHospitalByUserId(userId.toString()).getBody();
        if (hospitalDto == null) {
            throw new ResourceNotFoundException("Hospital not found with userId: " + userId);
        }

        // Map DTO to entity
        BloodRequest bloodRequest = new BloodRequest();
        bloodRequest.setBloodType(createRequestDto.getBloodType());
        bloodRequest.setUnitsRequired(createRequestDto.getUnitsRequired());
        bloodRequest.setUrgency(createRequestDto.getUrgency());
        bloodRequest.setHospitalId(hospitalDto.getId());
        bloodRequest.setHospitalName(hospitalDto.getHospitalName());
        bloodRequest.setLocation(modelMapper.map(hospitalDto.getServiceArea(), Point.class));


        if (createRequestDto.getExpiryTime() != null){
            bloodRequest.setExpiryTime(createRequestDto.getExpiryTime());
        }else{
            bloodRequest.setExpiryTime(setRequestExpiryTime(createRequestDto.getUrgency()));
        }


        bloodRequest.setStatus(RequestStatus.PENDING);

        BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);
        return modelMapper.map(savedRequest, BloodRequestDto.class);
    }

    /**
     * Gets request by ID
     * @param requestId Request ID
     * @return Request DTO
     */
    public BloodRequestDto getRequest(String requestId) {
        log.info("Fetching the blood request for request id: {}", requestId);
        BloodRequest bloodRequest = getBloodRequest(requestId);
        return modelMapper.map(bloodRequest, BloodRequestDto.class);
    }

    /**
     * Updates urgency level of a request
     * @param requestId Request ID
     * @param urgencyLevel New urgency level
     * @return Updated request DTO
     */
    public BloodRequestDto updateRequestUrgency(String requestId, UrgencyLevel urgencyLevel) {
        log.info("Updating urgency for request {} to {}", requestId, urgencyLevel);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        if (bloodRequest.getUrgency() == urgencyLevel) {
            throw new BadRequestException("Urgency is already set to same value");
        }
        bloodRequest.setUrgency(urgencyLevel);
        bloodRequest.setExpiryTime(setRequestExpiryTime(urgencyLevel));

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    /**
     * Updates request status
     * @param requestId Request ID
     * @param requestStatus New status
     * @return Updated request DTO
     */
    public BloodRequestDto updateRequestStatus(String requestId, RequestStatus requestStatus) {
        log.info("Updating status for request {} to {}", requestId, requestStatus);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        if (bloodRequest.getStatus() == requestStatus) {
            throw new BadRequestException("Request status is already set to the same value");
        }

        bloodRequest.setStatus(requestStatus);
        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    /**
     * Updates multiple request details
     * @param requestId Request ID
     * @param updateRequestDto Update data
     * @return Updated request DTO
     */
    public BloodRequestDto updateRequestDetails(String requestId, UpdateRequestDto updateRequestDto) {
        log.info("Updating details for request {}", requestId);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        // Check if any changes were made
        if (updateRequestDto.getUrgency().equals(bloodRequest.getUrgency())
                && updateRequestDto.getBloodType().equals(bloodRequest.getBloodType())
                && updateRequestDto.getUnitsRequired() == bloodRequest.getUnitsRequired()
                && updateRequestDto.getExpiryTime() == bloodRequest.getExpiryTime()) {
            throw new BadRequestException("No changes made");
        }

        // Apply updates
        bloodRequest.setExpiryTime(updateRequestDto.getExpiryTime());
        bloodRequest.setBloodType(updateRequestDto.getBloodType());
        bloodRequest.setUrgency(updateRequestDto.getUrgency());
        bloodRequest.setUnitsRequired(updateRequestDto.getUnitsRequired());

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    /**
     * Gets paginated list of all requests for current hospital
     * @param pageRequest Pagination parameters
     * @return Page of request DTOs
     */
    public Page<BloodRequestDto> getAllRequests(PageRequest pageRequest) {
        UUID userId = securityUtil.getCurrentUserId();
        HospitalDto hospitalDto = userServiceClient.getHospitalByUserId(userId.toString()).getBody();
        if (hospitalDto == null) {
            throw new ResourceNotFoundException("Hospital not found with userId: " + userId);
        }

        String hospitalId = hospitalDto.getId();
        log.info("Fetching requests for hospital {}", hospitalId);

        if (!bloodRequestRepository.existsByHospitalId(hospitalId)) {
            throw new ResourceNotFoundException("No requests found for hospital: " + hospitalId);
        }

        return bloodRequestRepository.findByHospitalId(hospitalId, pageRequest)
                .map(bloodRequest -> modelMapper.map(bloodRequest, BloodRequestDto.class));
    }

    /**
     * Sets expiry time based on urgency level
     * @param urgencyLevel Urgency level
     * @return Calculated expiry time
     */
    public LocalDateTime setRequestExpiryTime(UrgencyLevel urgencyLevel) {
        return switch (urgencyLevel) {
            case HIGH -> LocalDateTime.now().plusHours(24);
            case MEDIUM -> LocalDateTime.now().plusDays(5);
            case LOW -> LocalDateTime.now().plusDays(14);
        };
    }

    /**
     * Cancels a request
     * @param requestId Request ID
     * @return Cancelled request DTO
     */
    public BloodRequestDto cancelRequest(String requestId) {
        log.info("Canceling request {}", requestId);
        BloodRequest bloodRequest = getBloodRequest(requestId);
        bloodRequest.setStatus(RequestStatus.CANCELLED);
        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    /**
     * Gets blood request entity by ID
     * @param requestId Request ID
     * @return BloodRequest entity
     */
    public BloodRequest getBloodRequest(String requestId) {
        return bloodRequestRepository.findById(UUID.fromString(requestId))
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found: " + requestId));
    }

    /**
     * Gets filtered requests with dynamic query
     * @param status Filter by status
     * @param bloodType Filter by blood type
     * @param urgency Filter by urgency
     * @param expiryStart Filter by expiry start date
     * @param expiryEnd Filter by expiry end date
     * @param pageRequest Pagination parameters
     * @return Page of filtered request DTOs
     */
    public Page<BloodRequestDto> getFilteredRequests(
            RequestStatus status,
            BloodType bloodType,
            UrgencyLevel urgency,
            LocalDateTime expiryStart,
            LocalDateTime expiryEnd,
            PageRequest pageRequest) {

        Specification<BloodRequest> spec = Specification.where(null);

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (bloodType != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("bloodType"), bloodType));
        }
        if (urgency != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("urgency"), urgency));
        }
        if (expiryStart != null && expiryEnd != null) {
            spec = spec.and((root, query, cb) -> cb.between(root.get("expiryTime"), expiryStart, expiryEnd));
        } else if (expiryStart != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("expiryTime"), expiryStart));
        } else if (expiryEnd != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("expiryTime"), expiryEnd));
        }

        Page<BloodRequest> requests = bloodRequestRepository.findAll(spec, pageRequest);

        if (requests.isEmpty()) {
            throw new ResourceNotFoundException("No requests matching criteria");
        }

        return requests.map(request -> modelMapper.map(request, BloodRequestDto.class));
    }
}