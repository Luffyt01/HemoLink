package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.auth.UserContextHolder;
import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.BloodType;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.repositories.DonorRepository;
import com.project.hemolink.user_service.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.util.ReflectionUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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

    /*
     * Function to complete the donor profile
     */
    public DonorDto completeProfile(CompleteDonorProfileDto completeDonorProfileDto) {
        // Getting the userId of the current logged user
        String userId = UserContextHolder.getCurrentUserId();

        // Fetching the user
        // Checking if the user already exists in the repository
        User user = (User) userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        // Checking if the user profile is already completed
        if (user.isProfileComplete()){
            throw new BadRequestException("The profile is completed for the donor with email: "+user.getEmail());
        }
        log.info("Attempting to complete the profile for donor with email: {}", user.getEmail());

        // Mapping the details entered by the user to the donor object
        Donor donor = modelMapper.map(completeDonorProfileDto, Donor.class);
        user.setProfileComplete(true); // Marking the profile completed
        donor.setUser(userRepository.save(user));
        donor.setIsAvailable(true);
        Donor savedDonor = donorRepository.save(donor); // Saving the donor details

        return modelMapper.map(savedDonor, DonorDto.class);

    }

    /*
     * Function to update the donor availability
     */
    public DonorDto updateAvailability(AvailabilityDto availabilityDto) {
        String userId = UserContextHolder.getCurrentUserId();
        User user = (User) userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        Donor donor = donorRepository.findByUser(user)
                        .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email id: {}"+user.getEmail()));

        log.info("Attempting to update availability of the donor with email: {}", user.getEmail());

        donor.setIsAvailable(availabilityDto.isAvailable());

        return modelMapper.map(donorRepository.save(donor), DonorDto.class);
    }

    public DonorDto updateLocation(PointDTO updatedLocation){
        String userId = UserContextHolder.getCurrentUserId();
        User user = (User) userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        log.info("Updating the location for the donor with email: {}", user.getEmail());
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email id: {}"+user.getEmail()));

        donor.setLocation(modelMapper.map(updatedLocation, Point.class));

        Donor savedDonor = donorRepository.save(donor);
        log.info("Location updated");
        return modelMapper.map(savedDonor, DonorDto.class);
    }

    public DonorDto findDonorById(String donorId) {
        log.info("Fetching Donor by donorId: {}", donorId);
        Donor donor = donorRepository.findById(UUID.fromString(donorId))
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: "+donorId));

        return modelMapper.map(donor, DonorDto.class);
    }

    public DonorDto getDonorByUserId(String userId) {
        log.info("Fetching Donor by userId: {}", userId);
        User user = (User) userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with userId: "+userId));

        return modelMapper.map(donor, DonorDto.class);
    }


}
