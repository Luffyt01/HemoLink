package com.project.hemolink.user_service.controller;

import com.project.hemolink.user_service.dto.CompleteDonorProfileDto;
import com.project.hemolink.user_service.dto.CompleteHospitalProfileDto;
import com.project.hemolink.user_service.dto.DonorDto;
import com.project.hemolink.user_service.dto.HospitalDto;
import com.project.hemolink.user_service.services.DonorService;
import com.project.hemolink.user_service.services.HospitalService;
import com.project.hemolink.user_service.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<Object> getCompleteProfile(){
        return ResponseEntity.ok(profileService.getCompleteProfile());
    }

    @DeleteMapping("/delete")
    public void deleteProfile(){
        profileService.deleteProfile();
    }
}
