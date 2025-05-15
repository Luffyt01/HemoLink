package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.auth.UserContextHolder;
import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.BloodType;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.exception.ProfileCompletionException;
import com.project.hemolink.user_service.exception.ProfileOperationException;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.repositories.DonorRepository;
import com.project.hemolink.user_service.repositories.UserRepository;
import com.project.hemolink.user_service.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.util.ReflectionUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/*
 * Service Class to manage the donor related logic
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final SecurityUtil securityUtil;

    /*
     * Function to complete the donor profile
     */
    @Transactional
    @CachePut(value = "donors", key = "#result.id")
    public DonorDto completeProfile(CompleteDonorProfileDto completeDonorProfileDto) {
        try {
            // Fetching the userId of current logged user
            UUID userId = securityUtil.getCurrentUserId();

            // Fetching the user details from the repository
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            // Checking if the user profile is already completed or not
            if (user.isProfileComplete()) {
                throw new ProfileCompletionException("Profile already completed for donor with email: " + user.getEmail());
            }

            log.info("Completing donor profile for user: {}", user.getEmail());

            user.setProfileComplete(true);
            Donor donor = modelMapper.map(completeDonorProfileDto, Donor.class);
            donor.setUser(userRepository.save(user));

            // Saving the details
            Donor savedDonor = donorRepository.save(donor);
            log.info("Donor profile completed successfully");

            // mapping the saved details to the dto
            return modelMapper.map(savedDonor, DonorDto.class);

        } catch (ProfileCompletionException e) {
            log.error("Profile completion error: {}", e.getMessage());
            throw e;
        }
    }

    /*
     * Function to update the user availability (TRUE, FALSE)
     */
    @Transactional
    @CachePut(value = "donors", key = "#result.id")
    public DonorDto updateAvailability(AvailabilityDto availabilityDto) {
        try {

            String userId = UserContextHolder.getCurrentUserId();
            User user = userRepository.findById(UUID.fromString(userId))
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            Donor donor = donorRepository.findByUser(user)
                    .orElseThrow(() -> new ResourceNotFoundException("Donor not found for user: " + user.getEmail()));

            log.info("Updating availability for donor: {}", user.getEmail());
            donor.setIsAvailable(availabilityDto.isAvailable());

            return modelMapper.map(donorRepository.save(donor), DonorDto.class);

        } catch (ResourceNotFoundException e) {
            log.error("Resource not found: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error updating donor availability", e);
            throw new ProfileOperationException("Failed to update donor availability");
        }
    }



    @CachePut(value = "donors", key = "#result.id")
    @Transactional
    public DonorDto updateLocation(PointDTO updatedLocation){
        String userId = UserContextHolder.getCurrentUserId();
        User user = (User) userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        log.info("Updating the location for the donor with email: {}", user.getEmail());
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email id: {}"+user.getEmail()));

        donor.setLocation(modelMapper.map(updatedLocation, Point.class));

        Donor savedDonor = donorRepository.save(donor);
        log.info("Location updated");
        return modelMapper.map(savedDonor, DonorDto.class);
    }

//    @Cacheable(value = "donors", key = "#donorId")
    public DonorDto findDonorById(String donorId) {
        log.info("Fetching Donor by donorId: {}", donorId);
        Donor donor = donorRepository.findById(UUID.fromString(donorId))
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: "+donorId));

        return modelMapper.map(donor, DonorDto.class);
    }

    @Cacheable(value = "donors", key = "#result.id")
    public DonorDto getDonorByUserId(String userId) {
        log.info("Fetching Donor by userId: {}", userId);
        User user = (User) userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with userId: "+userId));

        return modelMapper.map(donor, DonorDto.class);
    }
}