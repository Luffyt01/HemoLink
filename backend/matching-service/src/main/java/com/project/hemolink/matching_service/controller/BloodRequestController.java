package com.project.hemolink.matching_service.controller;

import com.project.hemolink.matching_service.dto.*;
import com.project.hemolink.matching_service.entities.enums.BloodType;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import com.project.hemolink.matching_service.services.BloodRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('HOSPITAL')")
public class BloodRequestController {
    private final BloodRequestService bloodRequestService;


    @PostMapping("/create")
    public BloodRequestDto createRequest(@RequestBody CreateRequestDto createRequestDto){
        return bloodRequestService.createBloodRequest(createRequestDto);
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

    @PutMapping("/updateDetails/{requestId}")
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




    @GetMapping("/filter")
    public ResponseEntity<Page<BloodRequestDto>> getFilteredRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) BloodType bloodType,
            @RequestParam(required = false) UrgencyLevel urgency,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime expiryStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime expiryEnd,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "expiryTime,asc") String sort) {

        // Parse sort parameter
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 ?
                Sort.Direction.fromString(sortParams[1]) : Sort.Direction.ASC;

        Sort sortConfig = Sort.by(new Sort.Order(direction, sortParams[0]));
        PageRequest pageRequest = PageRequest.of(page, size, sortConfig);

        return ResponseEntity.ok(
                bloodRequestService.getFilteredRequests(
                        status,
                        bloodType,
                        urgency,
                        expiryStart,
                        expiryEnd,
                        pageRequest
                )
        );
    }

}
