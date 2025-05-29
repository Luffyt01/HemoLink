package com.project.hemolink.user_service.services;


import com.project.hemolink.user_service.entities.enums.BloodType;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class BloodTypeCompatibilityService {
    private static final Map<BloodType, List<BloodType>> COMPATIBILITY_MAP = Map.of(
            BloodType.A_POSITIVE, List.of(BloodType.A_POSITIVE, BloodType.A_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE),
            // Add all other blood type compatibilities
            BloodType.O_NEGATIVE, List.of(BloodType.O_NEGATIVE)
    );

    public List<BloodType> getCompatibleBloodTypes(BloodType recipientType) {
        return COMPATIBILITY_MAP.getOrDefault(recipientType, Collections.emptyList());
    }
}
