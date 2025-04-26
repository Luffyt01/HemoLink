package com.project.hemolink.user_service.client;

import com.project.hemolink.user_service.dto.BloodRequestDto;
import com.project.hemolink.user_service.dto.CreateRequestDto;
import com.project.hemolink.user_service.dto.RequestDetailDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "matching-service")
public interface MatchingServiceClient {

    @PostMapping("/matching/requests/create")
    BloodRequestDto createRequest(@RequestBody RequestDetailDto requestDetailDto);
}
