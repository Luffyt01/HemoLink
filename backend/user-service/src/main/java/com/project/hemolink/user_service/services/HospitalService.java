package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.auth.UserContextHolder;
import com.project.hemolink.user_service.client.MatchingServiceClient;
import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.entities.Hospital;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.UserRole;
import com.project.hemolink.user_service.entities.enums.VerificationStatus;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.repositories.HospitalRepository;
import com.project.hemolink.user_service.repositories.UserRepository;
import com.project.hemolink.user_service.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class HospitalService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final ModelMapper modelMapper;
    private final SecurityUtil securityUtil;

    public HospitalDto completeProfile(CompleteHospitalProfileDto completeHospitalProfileDto) {
        UUID userId = securityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        if (user.isProfileComplete()){
            throw new BadRequestException("The profile is completed for the hospital with email: "+user.getEmail());
        }
        log.info("Attempting to complete the profile for hospital with email: {}", user.getEmail());
        user.setProfileComplete(true);
        Hospital hospital = modelMapper.map(completeHospitalProfileDto, Hospital.class);
        hospital.setUser(userRepository.save(user));
        hospital.setVerificationStatus(VerificationStatus.PENDING);

        Hospital savedHospital = hospitalRepository.save(hospital);
        return modelMapper.map(savedHospital, HospitalDto.class);
    }


    public HospitalDto findHospitalById(String hospitalId) {
        log.info("Fetching hospital with hospitalId: {}", hospitalId);
        Hospital hospital = hospitalRepository.findById(UUID.fromString(hospitalId))
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with hospitalId: "+hospitalId));
        return modelMapper.map(hospital, HospitalDto.class);
    }

    public HospitalDto getHospitalByUserId(String userId) {
        log.info("Fetching the Hospital with userId: {}", userId);
        User user = (User) userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found for userId: "+userId));

        return modelMapper.map(hospital, HospitalDto.class);
    }
}
