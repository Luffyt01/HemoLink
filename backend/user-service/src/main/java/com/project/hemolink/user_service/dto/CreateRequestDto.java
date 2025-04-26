package com.project.hemolink.user_service.dto;


import com.project.hemolink.user_service.entities.enums.BloodType;
import com.project.hemolink.user_service.entities.enums.UrgencyLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateRequestDto {

    private BloodType bloodType;
    private int unitsRequired;
    private UrgencyLevel urgency;

}
