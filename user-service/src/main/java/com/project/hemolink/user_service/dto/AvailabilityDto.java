package com.project.hemolink.user_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class AvailabilityDto {

    @JsonProperty("isAvailable")
    private boolean isAvailable;
}
