package com.project.hemolink.matching_service.services;

import com.project.hemolink.matching_service.client.UserServiceClient;
import com.project.hemolink.matching_service.dto.ConfirmMatchDto;
import com.project.hemolink.matching_service.dto.DonationDto;
import com.project.hemolink.matching_service.dto.DonorDto;
import com.project.hemolink.matching_service.entities.BloodRequest;
import com.project.hemolink.matching_service.entities.Donation;
import com.project.hemolink.matching_service.entities.enums.DonationStatus;
import com.project.hemolink.matching_service.exception.DonorNotAvailableException;
import com.project.hemolink.matching_service.exception.ResourceNotFoundException;
import com.project.hemolink.matching_service.repositories.BloodRequestRepository;
import com.project.hemolink.matching_service.repositories.DonationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class DonationScheduleService {

    private final DonationRepository donationRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;

    @Transactional
    public DonationDto confirmDonation(ConfirmMatchDto confirmMatchDto) {
        log.info("Confirming donation for donor with id: {}", confirmMatchDto.getDonorId());

        // Verify donor exists and is eligible
        DonorDto donor = userServiceClient.getDonor(confirmMatchDto.getDonorId());
        if (!donor.isAvailable()){
            throw new DonorNotAvailableException("Donor not found with id: "+donor.getId());
        }

        BloodRequest bloodRequest = bloodRequestRepository.findById(UUID.fromString(confirmMatchDto.getRequestId()))
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: "+confirmMatchDto.getRequestId()));

        Donation donation = new Donation();
        donation.setDonorId(confirmMatchDto.getDonorId());
        donation.setRequest(bloodRequest);
        donation.setScheduledAt(confirmMatchDto.getScheduledTime());
        donation.setStatus(DonationStatus.SCHEDULED);

        Donation savedDonation = donationRepository.save(donation);

        userServiceClient.updateDonorAvailability(confirmMatchDto.getDonorId(), false);

        return modelMapper.map(savedDonation, DonationDto.class);
    }
}
