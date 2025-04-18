package com.project.hemolink.matching_service.services;

import com.project.hemolink.matching_service.dto.BloodRequestDto;
import com.project.hemolink.matching_service.dto.CreateRequestDto;
import com.project.hemolink.matching_service.dto.PointDTO;
import com.project.hemolink.matching_service.dto.UpdateRequestDto;
import com.project.hemolink.matching_service.entities.BloodRequest;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import com.project.hemolink.matching_service.exception.BadRequestException;
import com.project.hemolink.matching_service.exception.ResourceNotFoundException;
import com.project.hemolink.matching_service.repositories.BloodRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class BloodRequestService {
    private final BloodRequestRepository bloodRequestRepository;
    private final ModelMapper modelMapper;

    public BloodRequestDto createRequest(CreateRequestDto createRequestDto) {
        log.info("Creating a blood request for hospital with id: {}", "H1");

        BloodRequest bloodRequest = modelMapper.map(createRequestDto, BloodRequest.class);
        // TODO implement logic to set the actual hospital id
        bloodRequest.setHospitalId("H1");
        bloodRequest.setExpiryTime(setRequestExpiryTime(createRequestDto.getUrgency()));
        bloodRequest.setStatus(RequestStatus.PENDING);

        BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);
        return modelMapper.map(savedRequest, BloodRequestDto.class);
    }

    public BloodRequestDto getRequest(String requestId){
        log.info("Fetching the blood request for request id: {}", requestId);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        return modelMapper.map(bloodRequest, BloodRequestDto.class);
    }

    public BloodRequestDto updateRequestUrgency(String requestId, UrgencyLevel urgencyLevel){
        log.info("Updating the urgency for the blood request with id: {} to {}", requestId, urgencyLevel);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        if (bloodRequest.getUrgency() == urgencyLevel){
            throw new BadRequestException("Urgency is already set to same value");
        }
        bloodRequest.setUrgency(urgencyLevel);
        bloodRequest.setExpiryTime(setRequestExpiryTime(urgencyLevel));

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    public BloodRequestDto updateRequestStatus(String requestId, RequestStatus requestStatus){
        log.info("Updating the status for the blood request with id: {} to {}", requestId, requestStatus);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        if (bloodRequest.getStatus() == requestStatus){
            throw new BadRequestException("Request status is already set to the same value");
        }

        bloodRequest.setStatus(requestStatus);

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    public BloodRequestDto updateRequestDetails(String requestId, UpdateRequestDto updateRequestDto){
        log.info("Updating the details for blood request with id: {}", requestId);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        if (updateRequestDto.getUrgency().equals(bloodRequest.getUrgency())
            && updateRequestDto.getBloodType().equals(bloodRequest.getBloodType())
            && updateRequestDto.getStatus().equals(bloodRequest.getStatus())
            && updateRequestDto.getUnitsRequired() == bloodRequest.getUnitsRequired()
            && updateRequestDto.getLocation().equals(modelMapper.map(bloodRequest.getLocation(), PointDTO.class))){
            throw new BadRequestException("No changes made, Please change a value to make change");
        }

        bloodRequest.setBloodType(updateRequestDto.getBloodType());
        bloodRequest.setLocation(modelMapper.map(updateRequestDto.getLocation(), Point.class));
        bloodRequest.setUrgency(updateRequestDto.getUrgency());
        bloodRequest.setStatus(updateRequestDto.getStatus());
        bloodRequest.setUnitsRequired(updateRequestDto.getUnitsRequired());

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    public Page<BloodRequestDto> getAllRequests(PageRequest pageRequest){
        String hospitalId = "H1";
        log.info("Fetching all the requests for hospital with id: {}",hospitalId);

        boolean exists = bloodRequestRepository.existsByHospitalId(hospitalId);

        if (!exists){
            throw new ResourceNotFoundException("No blood request found for the hospital with id: "+hospitalId);
        }

        Page<BloodRequest> bloodRequests = bloodRequestRepository.findByHospitalId(hospitalId, pageRequest);

        return bloodRequests.map(
                bloodRequest -> modelMapper.map(bloodRequest, BloodRequestDto.class)
        );
    }

    public LocalDateTime setRequestExpiryTime(UrgencyLevel urgencyLevel){
        if (urgencyLevel == UrgencyLevel.HIGH){
            return LocalDateTime.now().plusHours(24);
        } else if (urgencyLevel == UrgencyLevel.MEDIUM){
            return LocalDateTime.now().plusDays(5);
        } else {
            return LocalDateTime.now().plusDays(14);
        }
    }

    public BloodRequestDto cancelRequest(String requestId){
        log.info("Canceling the request with id: {}", requestId);
        BloodRequest bloodRequest = getBloodRequest(requestId);

        bloodRequest.setStatus(RequestStatus.CANCELLED);

        return modelMapper.map(bloodRequestRepository.save(bloodRequest), BloodRequestDto.class);
    }

    public BloodRequest getBloodRequest(String requestId){
        return bloodRequestRepository.findById(UUID.fromString(requestId))
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: "+requestId));
    }
}
