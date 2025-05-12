package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.enums.BloodType;
import com.project.hemolink.user_service.entities.enums.UrgencyLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateRequestDto {

    @NotNull(message = "Blood type is required")
    private BloodType bloodType;

    @Min(value = 1, message = "Units required must be at least 1")
    private int unitsRequired;

    @NotNull(message = "Urgency level is required")
    private UrgencyLevel urgency;
}
