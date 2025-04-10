package com.project.hemolink.matching_service.controller;

import com.project.hemolink.matching_service.dto.BloodRequestDto;
import com.project.hemolink.matching_service.dto.CreateRequestDto;
import com.project.hemolink.matching_service.dto.UpdateRequestDto;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import com.project.hemolink.matching_service.services.BloodRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/requests")
@RequiredArgsConstructor
public class BloodRequestController {
    private final BloodRequestService bloodRequestService;

    @PostMapping("/create")
    public ResponseEntity<BloodRequestDto> createRequest(@RequestBody CreateRequestDto createRequestDto){
        return new ResponseEntity<>(bloodRequestService.createRequest(createRequestDto), HttpStatus.CREATED);
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<BloodRequestDto> getRequestById(@PathVariable String requestId){
        return ResponseEntity.ok(bloodRequestService.getRequest(requestId));
    }

    @PatchMapping("/{requestId}/urgency/{urgencyLevel}")
    public ResponseEntity<BloodRequestDto> updateUrgencyLevel(@PathVariable String requestId,
                                                              @PathVariable UrgencyLevel urgencyLevel){
        return ResponseEntity.ok(bloodRequestService.updateRequestUrgency(requestId, urgencyLevel));
    }

    @PatchMapping("/{requestId}/status/{requestStatus}")
    public ResponseEntity<BloodRequestDto> updateRequestStatus(@PathVariable String requestId,
                                                               @PathVariable RequestStatus requestStatus){
        return ResponseEntity.ok(bloodRequestService.updateRequestStatus(requestId, requestStatus));
    }

    @PutMapping("/{requestId}/updateDetails")
    public ResponseEntity<BloodRequestDto> updateRequestDetails(@PathVariable String requestId,
                                                                @RequestBody UpdateRequestDto updateRequestDto){
        return ResponseEntity.ok(bloodRequestService.updateRequestDetails(requestId, updateRequestDto));
    }

    @GetMapping("/getRequests")
    public ResponseEntity<Page<BloodRequestDto>> getAllRequests(@RequestParam (defaultValue = "0") Integer pageNumber,
                                                                @RequestParam (defaultValue = "10", required = false) Integer pageSize){
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);
        return ResponseEntity.ok(bloodRequestService.getAllRequests(pageRequest));
    }

    @PatchMapping("/{requestId}/cancel")
    public ResponseEntity<BloodRequestDto> cancelRequest(@PathVariable String requestId){
        return ResponseEntity.ok(bloodRequestService.cancelRequest(requestId));
    }


}
