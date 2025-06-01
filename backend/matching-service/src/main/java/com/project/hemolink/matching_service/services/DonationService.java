package com.project.hemolink.matching_service.services;

import com.project.hemolink.matching_service.dto.DonationDto;
import com.project.hemolink.matching_service.entities.BloodRequest;
import com.project.hemolink.matching_service.entities.Donation;
import com.project.hemolink.matching_service.entities.enums.DonationStatus;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import com.project.hemolink.matching_service.exception.BadRequestException;
import com.project.hemolink.matching_service.exception.InvalidDonationStatusException;
import com.project.hemolink.matching_service.exception.RequestExpiredException;
import com.project.hemolink.matching_service.exception.ResourceNotFoundException;
import com.project.hemolink.matching_service.repositories.BloodRequestRepository;
import com.project.hemolink.matching_service.repositories.DonationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service for managing donation records and statuses
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DonationService {
    private final DonationRepository donationRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final ModelMapper modelMapper;


    /**
     * Updates donation status
     * @param donationId Donation ID
     * @param status New status
     * @return Updated donation DTO
     */

    @Transactional
    public DonationDto updateDonationStatus(String donationId, DonationStatus status) {
        log.info("Updating status for donation {}", donationId);

        Donation donation = donationRepository.findById(UUID.fromString(donationId))
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found: "+donationId));

        if (donation.getStatus() == status) {
            throw new InvalidDonationStatusException("Status already set to " + status);
        }

        if (status == DonationStatus.COMPLETED && donation.getRequest().getStatus() == RequestStatus.EXPIRED) {
            throw new RequestExpiredException("Cannot complete expired request donation");
        }

        if (status == DonationStatus.COMPLETED) {
            donation.setCompletedAt(LocalDateTime.now());
            updateRequestStatusIfFullfilled(donation.getRequest());
        }

        return modelMapper.map(donationRepository.save(donation), DonationDto.class);
    }


    /**
     * Gets all donations by donor
     * @param donorId Donor ID
     * @return List of donation DTOs
     */
    public List<DonationDto> getDonationsByDonor(String donorId) {
        List<Donation> donations = donationRepository.findByDonorId(donorId);
        if (donations.isEmpty()) {
            throw new ResourceNotFoundException("No donations for donor "+donorId);
        }
        return donations.stream()
                .map(donation -> modelMapper.map(donation, DonationDto.class))
                .toList();
    }


    /**
     * Updates request status if required units are fulfilled
     * @param request Blood request to check
     */
    private void updateRequestStatusIfFullfilled(BloodRequest request) {
        long completedDonations = donationRepository.countByRequestIdAndStatus(
                request.getId(),
                DonationStatus.COMPLETED
        );

        if (completedDonations >= request.getUnitsRequired()) {
            request.setStatus(RequestStatus.FULFILLED);
            bloodRequestRepository.save(request);
        }
    }
}