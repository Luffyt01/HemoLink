package com.project.hemolink.matching_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class AutoMatchResultDto {

    private String requestId;
    private int totalMatches;
    private List<DonorMatchDto> topMatches;
}

