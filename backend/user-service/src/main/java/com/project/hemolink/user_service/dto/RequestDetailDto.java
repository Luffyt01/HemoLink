package com.project.hemolink.user_service.dto;

import com.project.hemolink.user_service.entities.enums.BloodType;
import com.project.hemolink.user_service.entities.enums.UrgencyLevel;
import lombok.Data;
import org.locationtech.jts.geom.Point;

@Data
public class RequestDetailDto {

    private BloodType bloodType;
    private int unitsRequired;
    private UrgencyLevel urgency;
    private String hospitalId;
    private String hospitalName;
    private PointDTO location;
}
