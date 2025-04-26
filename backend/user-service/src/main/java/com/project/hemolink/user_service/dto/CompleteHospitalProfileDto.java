package com.project.hemolink.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.awt.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompleteHospitalProfileDto {

    private String hospitalName;
    private String licenceNumber;
    private PointDTO serviceArea;
}
