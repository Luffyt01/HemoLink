package com.project.hemolink.user_service.controller;

import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.services.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hospitals")
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;



    @PostMapping("/completeProfile")
    public ResponseEntity<HospitalDto> completeProfile(@RequestBody CompleteHospitalProfileDto completeHospitalProfileDto){
        return ResponseEntity.ok(hospitalService.completeProfile(completeHospitalProfileDto));
    }

    @GetMapping("/{hospitalId}")
    public HospitalDto getHospital(@PathVariable String hospitalId){
        return hospitalService.findHospitalById(hospitalId);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<HospitalDto> getHospitalByUserId(@PathVariable String userId){
        return ResponseEntity.ok(hospitalService.getHospitalByUserId(userId));
    }
}
