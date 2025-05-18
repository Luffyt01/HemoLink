package com.project.hemolink.matching_service.controller;

import com.project.hemolink.matching_service.dto.*;
import com.project.hemolink.matching_service.services.DonationScheduleService;
import com.project.hemolink.matching_service.services.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pairing")
@RequiredArgsConstructor
public class DonorMatchingController {

    private final MatchingService matchingService;
    private final DonationScheduleService donationScheduleService;

    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<DonorMatchDto>> findCompatibleDonors(
            @PathVariable String requestId,
            @RequestParam(defaultValue = "5") int limit
    ){
        return ResponseEntity.ok(matchingService.findCompatibleDonors(requestId, limit));
    }

    @PostMapping("/auto-matching/{requestId}")
    public ResponseEntity<AutoMatchResultDto> triggerAutoMatch(
            @PathVariable String requestId
    ){
        return ResponseEntity.ok(matchingService.autoMatchDonors(requestId));
    }

    @PostMapping("/confirm")
    public ResponseEntity<DonationDto> confirmMatch(
            @RequestBody ConfirmMatchDto confirmMatchDto){
        return new ResponseEntity<>(donationScheduleService.confirmDonation(confirmMatchDto), HttpStatus.CREATED);
    }

    @PostMapping("/reject")
    public ResponseEntity<Void> rejectMatch(
            @RequestBody RejectMatchDto rejectMatchDto
            ){
        matchingService.rejectMatch(rejectMatchDto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/volunteer")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<VolunteerResponseDto> volunteerForRequest(
            @RequestBody VolunteerRequestDto volunteerRequest) {
        return new ResponseEntity<>(
                matchingService.processVolunteer(volunteerRequest),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/history/{donorId}")
    @PreAuthorize("hasRole('DONOR') and #donorId == authentication.principal.id")
    public ResponseEntity<List<DonorMatchHistoryDto>> getDonorMatchHistory(
            @PathVariable String donorId,
            @RequestParam(defaultValue = "false") boolean includeRejected) {
        return ResponseEntity.ok(
                matchingService.getDonorMatchHistory(donorId, includeRejected)
        );
    }

    @GetMapping("/request/{requestId}/donors")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<List<RequestMatchSummaryDto>> getRequestDonorMatches(
            @PathVariable String requestId) {
        return ResponseEntity.ok(
                matchingService.getRequestDonorMatches(requestId)
        );
    }

    @GetMapping("/request/{requestId}/status")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<RequestMatchingStatusDto> getRequestMatchingStatus(
            @PathVariable String requestId) {
        return ResponseEntity.ok(
                matchingService.getRequestMatchingStatus(requestId)
        );
    }
}
