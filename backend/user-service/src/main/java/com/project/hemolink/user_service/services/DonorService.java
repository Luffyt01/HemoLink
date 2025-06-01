package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.auth.UserContextHolder;
import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.BloodType;
import com.project.hemolink.user_service.exception.*;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Service handling donor-related operations including:
 * - Profile completion
 * - Availability management
 * - Location updates
 * - Donor search
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DonorService {
    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final SecurityUtil securityUtil;
    private final BloodTypeCompatibilityService compatibilityService;
    private final DistanceService distanceService;

    /**
     * Completes donor profile setup
     * @param completeDonorProfileDto Contains donor profile details
     * @return Created donor profile DTO
     * @throws ProfileCompletionException If profile already completed
     */
    @Transactional
    public DonorDto completeProfile(CompleteDonorProfileDto completeDonorProfileDto) {
        try {
            UUID userId = securityUtil.getCurrentUserId();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            if (user.isProfileComplete()) {
                throw new ProfileCompletionException("Profile already completed for donor with email: " + user.getEmail());
            }

            log.info("Completing donor profile for user: {}", user.getEmail());
            user.setProfileComplete(true);
            Donor donor = modelMapper.map(completeDonorProfileDto, Donor.class);
            donor.setUser(userRepository.save(user));

            Donor savedDonor = donorRepository.save(donor);
            log.info("Donor profile completed successfully");
            return modelMapper.map(savedDonor, DonorDto.class);

        } catch (ProfileCompletionException e) {
            log.error("Profile completion error: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Updates donor availability status
     * @param availabilityDto Contains new availability status
     * @return Updated donor DTO
     */
    @Transactional
    public DonorDto updateAvailability(AvailabilityDto availabilityDto) {
        try {
            UUID userId = securityUtil.getCurrentUserId();
            Donor donor = donorRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Donor not found with userId: "+userId));

            log.info("Updating availability for donor: {}", donor.getUser().getEmail());
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

    /**
     * Updates donor location
     * @param updatedLocation New location coordinates
     * @return Updated donor DTO
     */
    @Transactional
    public DonorDto updateLocation(PointDTO updatedLocation) {
        UUID userId = securityUtil.getCurrentUserId();
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with userId: "+userId));

        log.info("Updating location for donor: {}", donor.getUser().getEmail());
        donor.setLocation(modelMapper.map(updatedLocation, Point.class));
        Donor savedDonor = donorRepository.save(donor);
        log.info("Location updated");
        return modelMapper.map(savedDonor, DonorDto.class);
    }

    /**
     * Finds donor by ID
     * @param donorId Donor's unique ID
     * @return Donor DTO
     */
    public DonorDto findDonorById(String donorId) {
        log.info("Fetching Donor by donorId: {}", donorId);
        Donor donor = donorRepository.findById(UUID.fromString(donorId))
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: "+donorId));
        return modelMapper.map(donor, DonorDto.class);
    }

    /**
     * Finds donor by user ID
     * @param userId User's unique ID
     * @return Donor DTO
     */
    public DonorDto getDonorByUserId(String userId) {
        log.info("Fetching Donor by userId: {}", userId);
        Donor donor = donorRepository.findByUserId(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with userId: "+userId));
        return modelMapper.map(donor, DonorDto.class);
    }

    /**
     * Finds nearby eligible donors matching criteria
     * @param location Request location
     * @param bloodType Required blood type
     * @param radiusKm Search radius in kilometers
     * @param limit Maximum results to return
     * @return List of matching donors with distance information
     */
    public List<DonorMatchDto> findNearByEligibleDonors(Point location, BloodType bloodType, int radiusKm, int limit) {
        List<BloodType> compatibleTypes = compatibilityService.getCompatibleBloodTypes(bloodType);
        LocalDate minDate = LocalDate.now().minusDays(90);
        double radiusMeters = radiusKm * 1000;
        PageRequest pageRequest = PageRequest.of(0, limit);

        List<Donor> donors = donorRepository.findNearbyEligibleDonors(
                location,
                compatibleTypes,
                radiusMeters,
                minDate,
                pageRequest
        );

        return donors.stream()
                .map(donor -> {
                    DonorMatchDto dto = modelMapper.map(donor, DonorMatchDto.class);
                    dto.setDistanceKm(calculateDistance(location, donor.getLocation()));
                    return dto;
                })
                .toList();
    }

    private double calculateDistance(Point p1, Point p2) {
        return distanceService.calculateDistance(p1, p2);
    }
}