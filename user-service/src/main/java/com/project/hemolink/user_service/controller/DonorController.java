package com.project.hemolink.user_service.controller;

import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.enums.BloodType;
import com.project.hemolink.user_service.services.DonorService;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/donors")
@RequiredArgsConstructor
public class DonorController {
    private final DonorService donorService;

    @PostMapping("/completeProfile")
    public ResponseEntity<DonorDto> completeProfile(@RequestBody CompleteDonorProfileDto completeDonorProfileDto){
        return ResponseEntity.ok(donorService.completeProfile(completeDonorProfileDto));
    }

    @PatchMapping("/availability")
    public ResponseEntity<DonorDto> updateAvailability(@RequestBody AvailabilityDto availabilityDto){
        return ResponseEntity.ok(donorService.updateAvailability(availabilityDto));
    }

    @PatchMapping("/updateLocation")
    public ResponseEntity<DonorDto> updateLocation(@RequestBody LocationDto locationDto){
        return ResponseEntity.ok(donorService.updateLocation(locationDto.getLocation()));
    }

    @GetMapping("/{donorId}")
    public DonorDto getDonor(@PathVariable String donorId){
        return donorService.findDonorById(donorId);
    }

    @GetMapping("/nearby-eligible")
    public ResponseEntity<List<DonorMatchDto>> findNearbyEligibleDonors(
            @RequestParam String pointWkt,
            @RequestParam BloodType bloodType,
            @RequestParam int radiusKm,
            @RequestParam int limit
            ){

        Point point = wktToPoint(pointWkt);
        LocalDate minLastDonation = LocalDate.now().minusMonths(3);
        
        return ResponseEntity.ok(
                donorService.findNearByEligibleDonors(
                        point,
                        bloodType,
                        radiusKm * 1000,
                        minLastDonation,
                        PageRequest.of(0,limit)
                )
        );
    }

    private Point wktToPoint(String pointWkt) {
    }
}
