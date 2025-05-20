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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/*
 * Service class to handle the blood request logic
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class BloodRequestService {
    private final BloodRequestRepository bloodRequestRepository;
    private final ModelMapper modelMapper;
    private final UserServiceClient userServiceClient;
    private final SecurityUtil securityUtil;

    /*
     * Function to create a request
     */
    public BloodRequestDto createBloodRequest(CreateRequestDto createRequestDto) {
        UUID userId = securityUtil.getCurrentUserId();

        HospitalDto hospitalDto = userServiceClient.getHospitalByUserId(userId.toString()).getBody();
        if (hospitalDto == null) {
            throw new ResourceNotFoundException("Hospital not found with userId: " + userId);
        }

        BloodRequest bloodRequest = new BloodRequest();
        bloodRequest.setBloodType(createRequestDto.getBloodType());
        bloodRequest.setUnitsRequired(createRequestDto.getUnitsRequired());
        bloodRequest.setUrgency(createRequestDto.getUrgency());
        bloodRequest.setHospitalId(hospitalDto.getId());
        bloodRequest.setHospitalName(hospitalDto.getHospitalName());
        bloodRequest.setLocation(modelMapper.map(hospitalDto.getServiceArea(), Point.class));
        bloodRequest.setExpiryTime(setRequestExpiryTime(createRequestDto.getUrgency()));
        bloodRequest.setStatus(RequestStatus.PENDING);

        BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);
        return modelMapper.map(savedRequest, BloodRequestDto.class);
    }

    public BloodRequestDto getRequest(String requestId) {
        log.info("Fetching the blood request for request id: {}", requestId);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        return modelMapper.map(bloodRequest, BloodRequestDto.class);
    }

    public BloodRequestDto updateRequestUrgency(String requestId, UrgencyLevel urgencyLevel) {
        log.info("Updating the urgency for the blood request with id: {} to {}", requestId, urgencyLevel);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        if (bloodRequest.getUrgency() == urgencyLevel) {
            throw new BadRequestException("Urgency is already set to same value");
        }
        bloodRequest.setUrgency(urgencyLevel);
        bloodRequest.setExpiryTime(setRequestExpiryTime(urgencyLevel));

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    public BloodRequestDto updateRequestStatus(String requestId, RequestStatus requestStatus) {
        log.info("Updating the status for the blood request with id: {} to {}", requestId, requestStatus);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        if (bloodRequest.getStatus() == requestStatus) {
            throw new BadRequestException("Request status is already set to the same value");
        }

        bloodRequest.setStatus(requestStatus);

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    public BloodRequestDto updateRequestDetails(String requestId, UpdateRequestDto updateRequestDto) {
        log.info("Updating the details for blood request with id: {}", requestId);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        if (updateRequestDto.getUrgency().equals(bloodRequest.getUrgency())
                && updateRequestDto.getBloodType().equals(bloodRequest.getBloodType())
                && updateRequestDto.getStatus().equals(bloodRequest.getStatus())
                && updateRequestDto.getUnitsRequired() == bloodRequest.getUnitsRequired()
                && updateRequestDto.getLocation().equals(modelMapper.map(bloodRequest.getLocation(), PointDTO.class))) {
            throw new BadRequestException("No changes made, Please change a value to make change");
        }

        bloodRequest.setBloodType(updateRequestDto.getBloodType());
        bloodRequest.setLocation(modelMapper.map(updateRequestDto.getLocation(), Point.class));
        bloodRequest.setUrgency(updateRequestDto.getUrgency());
        bloodRequest.setStatus(updateRequestDto.getStatus());
        bloodRequest.setUnitsRequired(updateRequestDto.getUnitsRequired());

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    public Page<BloodRequestDto> getAllRequests(PageRequest pageRequest) {
        UUID userId = securityUtil.getCurrentUserId();

        HospitalDto hospitalDto = userServiceClient.getHospitalByUserId(userId.toString()).getBody();
        if (hospitalDto == null) {
            throw new ResourceNotFoundException("Hospital not found with userId: " + userId);
        }

        String hospitalId = hospitalDto.getId();
        log.info("Fetching all the requests for hospital with id: {}", hospitalId);

        boolean exists = bloodRequestRepository.existsByHospitalId(hospitalId);

        if (!exists) {
            throw new ResourceNotFoundException("No blood request found for the hospital with id: " + hospitalId);
        }

        Page<BloodRequest> bloodRequests = bloodRequestRepository.findByHospitalId(hospitalId, pageRequest);

        return bloodRequests.map(
                bloodRequest -> modelMapper.map(bloodRequest, BloodRequestDto.class));
    }

    public LocalDateTime setRequestExpiryTime(UrgencyLevel urgencyLevel) {
        if (urgencyLevel == UrgencyLevel.HIGH) {
            return LocalDateTime.now().plusHours(24);
        } else if (urgencyLevel == UrgencyLevel.MEDIUM) {
            return LocalDateTime.now().plusDays(5);
        } else {
            return LocalDateTime.now().plusDays(14);
        }
    }

    public BloodRequestDto cancelRequest(String requestId) {
        log.info("Canceling the request with id: {}", requestId);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        bloodRequest.setStatus(RequestStatus.CANCELLED);

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    public BloodRequest getBloodRequest(String requestId) {
        return bloodRequestRepository.findById(UUID.fromString(requestId))
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: " + requestId));
    }





    public Page<BloodRequestDto> getFilteredRequests(
            RequestStatus status,
            BloodType bloodType,
            UrgencyLevel urgency,
            LocalDateTime expiryStart,
            LocalDateTime expiryEnd,
            PageRequest pageRequest) {

        // Using Specifications to build dynamic query system
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
            throw new ResourceNotFoundException("No requests found matching the criteria");
        }

        return requests.map(request -> modelMapper.map(request, BloodRequestDto.class));
    }

}
