package com.project.hemolink.matching_service.controller;

import com.project.hemolink.matching_service.services.DonationScheduleService;
import com.project.hemolink.matching_service.services.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pairing")
@RequiredArgsConstructor
public class DonorMatchingController {

    private final MatchingService matchingService;
    private final DonationScheduleService donationScheduleService;


}
