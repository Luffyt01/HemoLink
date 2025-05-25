package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.dto.CompleteHospitalProfileDto;
import com.project.hemolink.user_service.dto.HospitalDto;
import com.project.hemolink.user_service.entities.Hospital;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.VerificationStatus;
import com.project.hemolink.user_service.exception.ProfileCompletionException;
import com.project.hemolink.user_service.exception.ProfileOperationException;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.repositories.HospitalRepository;
import com.project.hemolink.user_service.repositories.UserRepository;
import com.project.hemolink.user_service.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class HospitalService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final ModelMapper modelMapper;
    private final SecurityUtil securityUtil;

    @Transactional
    public HospitalDto completeProfile(CompleteHospitalProfileDto completeHospitalProfileDto) {
        try {
            // Fetching the user id of current logged user
            UUID userId = securityUtil.getCurrentUserId();

            // Fetching the user details from repository using the userId
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            // Checking if the user profile is competed or not
            if (user.isProfileComplete()) {
                throw new ProfileCompletionException("Profile already completed for hospital with email: " + user.getEmail());
            }

            log.info("Completing profile for hospital with email: {}", user.getEmail());

            user.setProfileComplete(true);
            Hospital hospital = modelMapper.map(completeHospitalProfileDto, Hospital.class);
            hospital.setUser(userRepository.save(user));
            hospital.setVerificationStatus(VerificationStatus.PENDING);
            hospital.setMainPhoneNo(user.getPhone());

            // Saving the complete hospital profile
            Hospital savedHospital = hospitalRepository.save(hospital);
            log.info("Hospital profile completed successfully");

            // mapping the saved details to dto class
            return modelMapper.map(savedHospital, HospitalDto.class);

        } catch (ProfileCompletionException e) {
            log.error("Profile completion error: {}", e.getMessage());
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public HospitalDto findHospitalById(String hospitalId) {
        try {
            log.info("Fetching hospital with ID: {}", hospitalId);
            Hospital hospital = hospitalRepository.findById(UUID.fromString(hospitalId))
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with ID: " + hospitalId));

            return modelMapper.map(hospital, HospitalDto.class);

        } catch (ResourceNotFoundException e) {
            log.error("Hospital not found: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error fetching hospital with ID: {}", hospitalId, e);
            throw new ProfileOperationException("Failed to fetch hospital details");
        }
    }



    public HospitalDto getHospitalByUserId(String userId) {
        log.info("Fetching the Hospital with userId: {}", userId);
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found for userId: "+userId));

        return modelMapper.map(hospital, HospitalDto.class);
    }
}

