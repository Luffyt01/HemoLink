package com.project.hemolink.matching_service.services;

import com.project.hemolink.matching_service.client.UserServiceClient;
import com.project.hemolink.matching_service.dto.*;
import com.project.hemolink.matching_service.entities.BloodRequest;
import com.project.hemolink.matching_service.entities.MatchLog;
import com.project.hemolink.matching_service.entities.enums.BloodType;
import com.project.hemolink.matching_service.entities.enums.NotificationStatus;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import com.project.hemolink.matching_service.entities.enums.VerificationStatus;
import com.project.hemolink.matching_service.exception.BadRequestException;
import com.project.hemolink.matching_service.exception.DonorNotAvailableException;
import com.project.hemolink.matching_service.exception.ResourceNotFoundException;
import com.project.hemolink.matching_service.repositories.BloodRequestRepository;
import com.project.hemolink.matching_service.repositories.DonationRepository;
import com.project.hemolink.matching_service.repositories.MatchLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

/**
 * Service for matching donors to blood requests
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingService {
    private final BloodRequestRepository requestRepository;
    private final UserServiceClient userServiceClient;
    private final MatchLogRepository matchLogRepository;
    private final DonationRepository donationRepository;
    private final ModelMapper modelMapper;

    /**
     * Finds compatible donors for a request
     * @param requestId Request ID
     * @param limit Maximum number of donors to return
     * @return List of compatible donors with scores
     */
    @Transactional(readOnly = true)
    public List<DonorMatchDto> findCompatibleDonors(String requestId, int limit) {
        log.info("Finding compatible donors for request {}", requestId);

        BloodRequest request = requestRepository.findById(UUID.fromString(requestId))
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: "+requestId));

        // Verify hospital
        HospitalDto hospitalDto = userServiceClient.getHospital(request.getHospitalId());
//        if (hospitalDto.getVerificationStatus() != VerificationStatus.VERIFIED) {
//            throw new BadRequestException("Hospital not verified: "+request.getHospitalId());
//        }

        // Convert location to WKT format


        // Find eligible donors
        List<DonorMatchDto> donors = userServiceClient.findNearByEligibleDonors(
                request.getLocation(),
                request.getBloodType(),
                50, // 50km radius
                limit
        );

        // Calculate scores for each donor
        donors.forEach(donor -> {
            double distanceScore = normalizeDistance(donor.getDistanceKm());
            double recencyScore = calculateRecencyScore(donor.getLastDonationDate());
            donor.setScore((distanceScore*0.6) + (recencyScore * 0.4)); // Weighted score
        });

        // Sort by score and limit results
        return donors.stream()
                .sorted((d1, d2) -> Double.compare(d2.getScore(), d1.getScore()))
                .limit(limit)
                .toList();
    }

    /**
     * Calculates recency score based on last donation date
     * @param lastDonationDate Last donation date
     * @return Score (0-1)
     */
    private double calculateRecencyScore(LocalDate lastDonationDate) {
        long daysSinceDonation = ChronoUnit.DAYS.between(lastDonationDate, LocalDate.now());
        return Math.max(0, 1-(daysSinceDonation/180.0)); // 6 month window
    }

    /**
     * Normalizes distance to 0-1 range
     * @param distanceKm Distance in km
     * @return Normalized score
     */
    private double normalizeDistance(double distanceKm) {
        return 1 - Math.min(distanceKm / 100, 1); // 100km max distance
    }

    /**
     * Converts point to WKT format
     * @param location Point location
     * @return WKT string
     */
    private String convertToWKT(Point location) {
        return String.format("POINT(%f %f)", location.getX(), location.getY());
    }

    /**
     * Performs auto-matching for a request
     * @param requestId Request ID
     * @return Auto-match result with top matches
     */
    public AutoMatchResultDto autoMatchDonors(String requestId) {
        List<DonorMatchDto> matches = findCompatibleDonors(requestId, 5);
        return AutoMatchResultDto.builder()
                .requestId(requestId)
                .totalMatches(matches.size())
                .topMatches(matches)
                .build();
    }

    /**
     * Handles donor rejection of a match
     * @param rejectMatchDto Rejection details
     */
    public void rejectMatch(RejectMatchDto rejectMatchDto) {
        MatchLog matchLog = matchLogRepository.findById(UUID.fromString(rejectMatchDto.getMatchId()))
                .orElseThrow(() -> new ResourceNotFoundException("Match not found: "+rejectMatchDto.getMatchId()));

        matchLog.setStatus(NotificationStatus.FAILED);
        matchLogRepository.save(matchLog);

        log.info("Match {} rejected by donor {}: {}",
                rejectMatchDto.getMatchId(),
                rejectMatchDto.getDonorId(),
                rejectMatchDto.getReason());
    }
}