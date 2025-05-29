package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.entities.enums.BloodType;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Service handling blood type compatibility logic
 */
@Service
public class BloodTypeCompatibilityService {
    // Mapping of blood types to their compatible donor types
    private static final Map<BloodType, List<BloodType>> COMPATIBILITY_MAP = Map.of(
            BloodType.A_POSITIVE, List.of(BloodType.A_POSITIVE, BloodType.A_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE),
            BloodType.A_NEGATIVE, List.of(BloodType.A_NEGATIVE, BloodType.O_NEGATIVE),
            BloodType.B_POSITIVE, List.of(BloodType.B_POSITIVE, BloodType.B_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE),
            BloodType.B_NEGATIVE, List.of(BloodType.B_NEGATIVE, BloodType.O_NEGATIVE),
            BloodType.AB_POSITIVE, List.of(BloodType.A_POSITIVE, BloodType.A_NEGATIVE,
                    BloodType.B_POSITIVE, BloodType.B_NEGATIVE,
                    BloodType.AB_POSITIVE, BloodType.AB_NEGATIVE,
                    BloodType.O_POSITIVE, BloodType.O_NEGATIVE),
            BloodType.AB_NEGATIVE, List.of(BloodType.A_NEGATIVE, BloodType.B_NEGATIVE,
                    BloodType.AB_NEGATIVE, BloodType.O_NEGATIVE),
            BloodType.O_POSITIVE, List.of(BloodType.O_POSITIVE, BloodType.O_NEGATIVE),
            BloodType.O_NEGATIVE, List.of(BloodType.O_NEGATIVE)
    );

    /**
     * Gets compatible blood types for a recipient
     * @param recipientType The recipient's blood type
     * @return List of compatible donor blood types
     */
    public List<BloodType> getCompatibleBloodTypes(BloodType recipientType) {
        return COMPATIBILITY_MAP.getOrDefault(recipientType, Collections.emptyList());
    }
}