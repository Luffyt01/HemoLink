package com.project.hemolink.matching_service.client;

import com.project.hemolink.matching_service.dto.DonorDto;
import com.project.hemolink.matching_service.dto.DonorMatchDto;
import com.project.hemolink.matching_service.dto.HospitalDto;
import com.project.hemolink.matching_service.entities.enums.BloodType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "user-service", path = "/users")
public interface UserServiceClient {

    @GetMapping("/donors/{donorId}")
    DonorDto getDonor(@PathVariable String donorId);

    @GetMapping("/hospitals/{hospitalId}")
    HospitalDto getHospital(@PathVariable String hospitalId);

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
}
