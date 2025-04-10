package com.project.hemolink.user_service.controller;

import com.project.hemolink.user_service.dto.AvailabilityDto;
import com.project.hemolink.user_service.dto.CompleteDonorProfileDto;
import com.project.hemolink.user_service.dto.DonorDto;
import com.project.hemolink.user_service.dto.LocationDto;
import com.project.hemolink.user_service.services.DonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
