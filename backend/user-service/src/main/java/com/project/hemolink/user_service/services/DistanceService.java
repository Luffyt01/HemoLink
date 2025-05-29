package com.project.hemolink.user_service.services;

import lombok.Data;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * Service for calculating distances using OSRM routing engine
 */
@Service
public class DistanceService {
    private static final String OSRM_API_BASE_URL = "http://router.project-osrm.org/route/v1/driving/";

    /**
     * Calculates road distance between two geographic points
     * @param src Source location
     * @param dest Destination location
     * @return Distance in kilometers
     * @throws RuntimeException if OSRM request fails
     */
    public double calculateDistance(Point src, Point dest) {
        try {
            String coordinates = src.getX()+","+src.getY()+";"+dest.getX()+","+dest.getY();

            OsrmResponseDTO response = RestClient.builder()
                    .baseUrl(OSRM_API_BASE_URL)
                    .build()
                    .get()
                    .uri(coordinates)
                    .retrieve()
                    .body(OsrmResponseDTO.class);

            double calculatedDistance = response.getRoutes().get(0).getDistance();
            if (calculatedDistance == 0) {
                return 0.0;
            }
            return calculatedDistance / 1000.0; // Convert meters to km
        } catch (Exception e) {
            throw new RuntimeException("OSRM request failed: " + e.getMessage());
        }
    }
}

/**
 * DTO for OSRM route response
 */
@Data
class OsrmResponseDTO {
    private List<OsrmRoute> routes;
}

/**
 * DTO for OSRM route details
 */
@Data
class OsrmRoute {
    private double distance; // Distance in meters
    private double duration; // Duration in seconds
}