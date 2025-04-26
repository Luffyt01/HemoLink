package com.project.hemolink.user_service.controller;

import com.project.hemolink.user_service.dto.BloodRequestDto;
import com.project.hemolink.user_service.dto.CompleteHospitalProfileDto;
import com.project.hemolink.user_service.dto.CreateRequestDto;
import com.project.hemolink.user_service.dto.HospitalDto;
import com.project.hemolink.user_service.services.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hospitals")
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;

    @PostMapping("/create-request")
    public ResponseEntity<BloodRequestDto> createBloodRequest(@RequestBody CreateRequestDto createRequestDto){
        return new ResponseEntity<>(hospitalService.createBloodRequest(createRequestDto), HttpStatus.CREATED);
    }

    @PostMapping("/completeProfile")
    public ResponseEntity<HospitalDto> completeProfile(@RequestBody CompleteHospitalProfileDto completeHospitalProfileDto){
        return ResponseEntity.ok(hospitalService.completeProfile(completeHospitalProfileDto));
    }
}
