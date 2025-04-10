package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.auth.UserContextHolder;
import com.project.hemolink.user_service.dto.AvailabilityDto;
import com.project.hemolink.user_service.dto.CompleteDonorProfileDto;
import com.project.hemolink.user_service.dto.DonorDto;
import com.project.hemolink.user_service.dto.PointDTO;
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
import org.springframework.data.util.ReflectionUtils;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;


    public DonorDto completeProfile(CompleteDonorProfileDto completeDonorProfileDto) {
        String userId = UserContextHolder.getCurrentUserId();
        User user = (User) userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        if (user.isProfileComplete()){
            throw new BadRequestException("The profile is completed for the donor with email: "+user.getEmail());
        }
        log.info("Attempting to complete the profile for donor with email: {}", user.getEmail());

        Donor donor = modelMapper.map(completeDonorProfileDto, Donor.class);

        user.setProfileComplete(true);

        donor.setUser(userRepository.save(user));

        donor.setAvailable(true);

        Donor savedDonor = donorRepository.save(donor);

        return modelMapper.map(savedDonor, DonorDto.class);

    }

    public DonorDto updateAvailability(AvailabilityDto availabilityDto) {
        String userId = UserContextHolder.getCurrentUserId();
        User user = (User) userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        Donor donor = donorRepository.findByUser(user)
                        .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email id: {}"+user.getEmail()));

        log.info("Attempting to update availability of the donor with email: {}", user.getEmail());

        donor.setAvailable(availabilityDto.isAvailable());

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
}
