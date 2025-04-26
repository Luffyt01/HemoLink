package com.project.hemolink.matching_service.dto;


import com.project.hemolink.matching_service.entities.enums.BloodType;
import com.project.hemolink.matching_service.entities.enums.UrgencyLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateRequestDto {

    private BloodType bloodType;
    private int unitsRequired;
    private UrgencyLevel urgency;
    private String hospitalId;
    private String hospitalName;
    private Point location;
}
