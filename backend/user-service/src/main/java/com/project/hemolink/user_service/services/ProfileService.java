package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.auth.UserContextHolder;
import com.project.hemolink.user_service.dto.DonorDto;
import com.project.hemolink.user_service.dto.HospitalDto;
import com.project.hemolink.user_service.dto.UserDto;
import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.Hospital;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.UserRole;
import com.project.hemolink.user_service.exception.ProfileOperationException;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.repositories.DonorRepository;
import com.project.hemolink.user_service.repositories.HospitalRepository;
import com.project.hemolink.user_service.repositories.UserRepository;
import com.project.hemolink.user_service.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final ModelMapper modelMapper;
    private final SecurityUtil securityUtil;


//    @Cacheable(value = "userProfiles", key = "#root.methodName + ':'+ T(com.project.hemolink.user_service.auth.UserContextHolder).getCurrentUserId()")
    public Object getCompleteProfile() {
        try {
            UUID userId = securityUtil.getCurrentUserId();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            log.info("Fetching profile for {}: {}", user.getRole(), user.getEmail());

            return switch (user.getRole()) {
                case DONOR -> getDonorProfile(user);
                case HOSPITAL -> getHospitalProfile(user);
                default -> modelMapper.map(user, UserDto.class);
            };

        } catch (ResourceNotFoundException e) {
            log.error("Profile fetch error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error fetching profile", e);
            throw new ProfileOperationException("Failed to fetch profile");
        }
    }

//    @Cacheable(value = "userProfiles", key = "#root.methodName + ':'+ T(com.project.hemolink.user_service.auth.UserContextHolder).getCurrentUserId()")
    public DonorDto getDonorProfile(User user){
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: "+user.getEmail()));
        return modelMapper.map(donor, DonorDto.class);
    }

//    @Cacheable(value = "userProfiles", key = "#root.methodName + ':'+ T(com.project.hemolink.user_service.auth.UserContextHolder).getCurrentUserId()")
    public HospitalDto getHospitalProfile(User user){
        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: "+user.getEmail()));
        return modelMapper.map(hospital, HospitalDto.class);
    }

    @CacheEvict(value = "userProfiles", key = "'getCompleteProfile:' + T(com.project.hemolink.user_service.auth.UserContextHolder).getCurrentUserId()")
    public void deleteProfile() {
        try {
            String userId = UserContextHolder.getCurrentUserId();
            User user = userRepository.findById(UUID.fromString(userId))
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            log.info("Deleting profile for {}: {}", user.getRole(), user.getEmail());

            if (user.getRole().equals(UserRole.DONOR)) {
                deleteDonorProfile(user);
            } else if (user.getRole().equals(UserRole.HOSPITAL)) {
                deleteHospitalProfile(user);
            }

            userRepository.delete(user);
            log.info("Profile deleted successfully");

        } catch (ResourceNotFoundException e) {
            log.error("Profile deletion error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error deleting profile", e);
            throw new ProfileOperationException("Failed to delete profile");
        }
    }

    public void deleteDonorProfile(User user){
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: "+user.getEmail()));
        donorRepository.delete(donor);
    }
    public void deleteHospitalProfile(User user){
        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: "+user.getEmail()));
        hospitalRepository.delete(hospital);
    }
}
