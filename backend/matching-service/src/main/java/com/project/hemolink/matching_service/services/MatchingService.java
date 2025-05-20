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

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingService {

    private final BloodRequestRepository requestRepository;
    private final UserServiceClient userServiceClient;
    private final MatchLogRepository matchLogRepository;
    private final DonationRepository donationRepository;
    private final ModelMapper modelMapper;


    @Transactional(readOnly = true)
    public List<DonorMatchDto> findCompatibleDonors(String requestId, int limit) {
        log.info("Attempting to find compatible donors for request with id: {}", requestId);

        BloodRequest request = requestRepository.findById(UUID.fromString(requestId))
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with request id: "+requestId));

        HospitalDto hospitalDto = userServiceClient.getHospital(request.getHospitalId());

        if (hospitalDto.getVerificationStatus() != VerificationStatus.VERIFIED){
            throw new BadRequestException("Hospital not verified with id: "+request.getHospitalId());
        }
        String pointWkt = convertToWKT(request.getLocation());

        List<DonorMatchDto> donors = userServiceClient.findNearByEligibleDonors(
                pointWkt,
                request.getBloodType(),
                50,
                limit
        );

        donors.forEach(donor -> {
            double distanceScore = normalizeDistance(donor.getDistanceKm());
            double recencyScore = calculateRecencyScore(donor.getLastDonationDate());
            donor.setScore((distanceScore*0.6) + (recencyScore * 0.4));
        });

        return donors.stream()
                .sorted((d1, d2) -> Double.compare(d2.getScore(), d1.getScore()))
                .limit(limit)
                .toList();
    }

    private double calculateRecencyScore(LocalDate lastDonationDate) {
        long daysSinceDonation = ChronoUnit.DAYS.between(lastDonationDate, LocalDate.now());
        return Math.max(0, 1-(daysSinceDonation/180.0)); // 6 month windows
    }

    private double normalizeDistance(double distanceKm) {
        return 1 - Math.min(distanceKm / 100, 1);
    }

    private String convertToWKT(Point location) {
        return String.format("POINT(%f %f)", location.getX(), location.getY());
    }

    public AutoMatchResultDto autoMatchDonors(String requestId) {
        List<DonorMatchDto> matches = findCompatibleDonors(requestId, 5);
        return AutoMatchResultDto.builder()
                .requestId(requestId)
                .totalMatches(matches.size())
                .topMatches(matches)
                .build();
    }

    public void rejectMatch(RejectMatchDto rejectMatchDto) {
        MatchLog matchLog = matchLogRepository.findById(UUID.fromString(rejectMatchDto.getMatchId()))
                .orElseThrow(() -> new ResourceNotFoundException("Match not found for match id: "+rejectMatchDto.getMatchId()));
        matchLog.setStatus(NotificationStatus.FAILED);
        matchLogRepository.save(matchLog);

        log.info("Match {} rejected by donor {}: {}",
                rejectMatchDto.getMatchId(),
                rejectMatchDto.getDonorId(),
                rejectMatchDto.getReason());

    }


    @Transactional
    public VolunteerResponseDto processVolunteer(VolunteerRequestDto volunteerRequest) {
        BloodRequest request = requestRepository.findById(UUID.fromString(volunteerRequest.getRequestId()))
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Request is no longer available for volunteering");
        }

        DonorDto donor = userServiceClient.getDonor(volunteerRequest.getDonorId());
        if (!donor.isAvailable()) {
            throw new DonorNotAvailableException("Donor is not currently available");
        }

        // Check compatibility
        if (!isBloodTypeCompatible(request.getBloodType(), donor.getBloodType())) {
            throw new BadRequestException("Blood type incompatible");
        }

        MatchLog matchLog = new MatchLog();
        matchLog.setRequestId(volunteerRequest.getRequestId());
        matchLog.setDonorId(volunteerRequest.getDonorId());
        matchLog.setMatchedAt(LocalDateTime.now());
        matchLog.setStatus(NotificationStatus.VOLUNTEERED);
        matchLog.setVolunteered(true);
        matchLogRepository.save(matchLog);

        return VolunteerResponseDto.builder()
                .matchId(matchLog.getId().toString())
                .requestId(request.getId().toString())
                .donorId(donor.getId())
                .status("VOLUNTEERED")
                .build();
    }

    public List<DonorMatchHistoryDto> getDonorMatchHistory(String donorId, boolean includeRejected) {
        List<MatchLog> matches = includeRejected ?
                matchLogRepository.findByDonorId(donorId) :
                matchLogRepository.findByDonorIdAndStatusNot(donorId, NotificationStatus.FAILED);

        return matches.stream()
                .map(match -> {
                    BloodRequest request = requestRepository.findById(UUID.fromString(match.getRequestId()))
                            .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

                    return DonorMatchHistoryDto.builder()
                            .matchId(match.getId().toString())
                            .requestId(match.getRequestId())
                            .bloodType(request.getBloodType())
                            .urgency(request.getUrgency())
                            .matchedAt(match.getMatchedAt())
                            .status(match.getStatus())
                            .hospitalName(request.getHospitalName())
                            .build();
                })
                .toList();
    }

    // TODO add OSRM FOR calculating distance
    public List<RequestMatchSummaryDto> getRequestDonorMatches(String requestId) {
        return matchLogRepository.findByRequestId(requestId).stream()
                .map(match -> {
                    DonorDto donor = userServiceClient.getDonor(match.getDonorId());
                    return RequestMatchSummaryDto.builder()
                            .matchId(match.getId().toString())
                            .donorId(match.getDonorId())
                            .donorName(donor.getName())
                            .bloodType(donor.getBloodType())
                            .status(match.getStatus())
                            .distanceKm(userServiceClient.calculateDistance(
                                    requestId,
                                    match.getDonorId()
                            ))
                            .build();
                })
                .toList();
    }

    public RequestMatchingStatusDto getRequestMatchingStatus(String requestId) {
        BloodRequest request = requestRepository.findById(UUID.fromString(requestId))
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        long totalMatches = matchLogRepository.countByRequestId(requestId);
        long confirmedMatches = donationRepository.countByRequestId(UUID.fromString(requestId));

        return RequestMatchingStatusDto.builder()
                .requestId(requestId)
                .status(request.getStatus())
                .totalMatches(totalMatches)
                .confirmedDonations(confirmedMatches)
                .unitsRequired(request.getUnitsRequired())
                .unitsFulfilled(donationRepository.sumCompletedUnitsByRequest(requestId))
                .build();
    }

    private boolean isBloodTypeCompatible(BloodType requestType, BloodType donorType) {
        // Implement blood type compatibility logic
        return true; // Simplified for example
    }
}
