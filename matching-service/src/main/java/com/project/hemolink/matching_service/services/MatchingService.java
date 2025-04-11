package com.project.hemolink.matching_service.services;

import com.project.hemolink.matching_service.client.DonationClient;
import com.project.hemolink.matching_service.dto.AutoMatchResultDto;
import com.project.hemolink.matching_service.dto.DonorMatchDto;
import com.project.hemolink.matching_service.dto.RejectMatchDto;
import com.project.hemolink.matching_service.repositories.BloodRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingService {

    private final BloodRequestRepository requestRepository;



    public List<DonorMatchDto> findCompatibleDonors(String requestId, int limit) {
        return null;
    }

    public AutoMatchResultDto autoMatchDonors(String requestId) {
        return null;
    }

    public void rejectMatch(RejectMatchDto rejectMatchDto) {

    }
}
