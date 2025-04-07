package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.auth.UserContextHolder;
import com.project.hemolink.user_service.dto.CompleteHospitalProfileDto;
import com.project.hemolink.user_service.dto.HospitalDto;
import com.project.hemolink.user_service.entities.Hospital;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.VerificationStatus;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.repositories.HospitalRepository;
import com.project.hemolink.user_service.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class HospitalService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final ModelMapper modelMapper;


    public HospitalDto completeProfile(CompleteHospitalProfileDto completeHospitalProfileDto) {
        String userId = UserContextHolder.getCurrentUserId();
        User user = (User) userRepository.findById(userId)
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
}
