package com.project.hemolink.matching_service.services;

import com.project.hemolink.matching_service.client.UserServiceClient;
import com.project.hemolink.matching_service.dto.ConfirmMatchDto;
import com.project.hemolink.matching_service.dto.DonationDto;
import com.project.hemolink.matching_service.dto.DonorDto;
import com.project.hemolink.matching_service.entities.BloodRequest;
import com.project.hemolink.matching_service.entities.Donation;
import com.project.hemolink.matching_service.entities.enums.DonationStatus;
import com.project.hemolink.matching_service.exception.DonorNotAvailableException;
import com.project.hemolink.matching_service.exception.MatchConflictException;
import com.project.hemolink.matching_service.exception.ResourceNotFoundException;
import com.project.hemolink.matching_service.repositories.BloodRequestRepository;
import com.project.hemolink.matching_service.repositories.DonationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service for scheduling and managing donations
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DonationScheduleService {
    private final DonationRepository donationRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;

    /**
     * Confirms a donation match and schedules it
     * @param confirmMatchDto Match confirmation details
     * @return Scheduled donation DTO
     * @throws MatchConflictException if donation already exists
     * @throws DonorNotAvailableException if donor is unavailable
     */
    @Transactional
    public DonationDto confirmDonation(ConfirmMatchDto confirmMatchDto) {
        log.info("Confirming donation for donor {}", confirmMatchDto.getDonorId());

        // Check for existing donation
        if (donationRepository.existsByDonorIdAndRequestId(
                confirmMatchDto.getDonorId(),
                UUID.fromString(confirmMatchDto.getRequestId())))
        {
            throw new MatchConflictException("Donation match already exists");
        }

        // Verify donor eligibility
        DonorDto donor = userServiceClient.getDonor(confirmMatchDto.getDonorId());
        if (!donor.isAvailable()) {
            throw new DonorNotAvailableException("Donor unavailable: "+donor.getId());
        }

        BloodRequest request = bloodRequestRepository.findById(UUID.fromString(confirmMatchDto.getRequestId()))
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: "+confirmMatchDto.getRequestId()));

        // Create donation record
        Donation donation = new Donation();
        donation.setDonorId(confirmMatchDto.getDonorId());
        donation.setRequest(request);
        donation.setScheduledAt(confirmMatchDto.getScheduledTime());
        donation.setStatus(DonationStatus.SCHEDULED);

        Donation savedDonation = donationRepository.save(donation);

        // Update donor availability
        userServiceClient.updateDonorAvailability(confirmMatchDto.getDonorId(), false);

        return modelMapper.map(savedDonation, DonationDto.class);
    }
}