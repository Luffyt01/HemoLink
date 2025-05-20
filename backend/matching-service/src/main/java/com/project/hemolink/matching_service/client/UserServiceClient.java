package com.project.hemolink.matching_service.client;

import com.project.hemolink.matching_service.config.FeignClientConfig;
import com.project.hemolink.matching_service.dto.DonorDto;
import com.project.hemolink.matching_service.dto.DonorMatchDto;
import com.project.hemolink.matching_service.dto.HospitalDto;
import com.project.hemolink.matching_service.entities.enums.BloodType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "user-service",
        path = "/users",
        configuration = FeignClientConfig.class)
public interface UserServiceClient {

    @GetMapping("/donors/{donorId}")
    DonorDto getDonor(@PathVariable String donorId);

    @GetMapping("/donors/by-user/{userId}")
    ResponseEntity<DonorDto> getDonorByUserId(@PathVariable String userId);

    @GetMapping("/hospitals/{hospitalId}")
    HospitalDto getHospital(@PathVariable String hospitalId);


    @GetMapping("/hospitals/by-user/{userId}")
    ResponseEntity<HospitalDto> getHospitalByUserId(@PathVariable String userId);


    @GetMapping("/donors/eligible")
    List<DonorMatchDto> findNearByEligibleDonors(
            @RequestParam("point") String pointWkt,
            @RequestParam BloodType bloodType,
            @RequestParam int radiusKm,
            @RequestParam int limit
    );

    @PatchMapping("/donors/{donorId}/availability")
    void updateDonorAvailability(
            @PathVariable String donorId,
            @RequestParam boolean available);


//    double calculateDistance(String requestId, String donorId);
}
