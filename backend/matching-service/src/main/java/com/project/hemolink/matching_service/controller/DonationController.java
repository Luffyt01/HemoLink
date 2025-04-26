package com.project.hemolink.matching_service.controller;

import com.project.hemolink.matching_service.dto.DonationDto;
import com.project.hemolink.matching_service.dto.DonationStatusDto;
import com.project.hemolink.matching_service.services.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
public class DonationController {
    private final DonationService donationService;

    @PatchMapping("{donationId}/status")
    public ResponseEntity<DonationDto> updateDonationStatus(
            @PathVariable String donationId,
            @RequestBody DonationStatusDto statusDto){
        return ResponseEntity.ok(
                donationService.updateDonationStatus(donationId,statusDto.getNewStatus())
        );
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<DonationDto>> getDonorDonations(
            @PathVariable String donorId){
        return ResponseEntity.ok(donationService.getDonationsByDonor(donorId));
    }

}
