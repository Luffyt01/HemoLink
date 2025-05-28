package com.project.hemolink.matching_service.services;

import lombok.Data;
import org.locationtech.jts.geom.Point;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * Service for calculating distances using OSRM routing engine
 */
public class DistanceService {
    private static final String OSRM_API_BASE_URL = "http://router.project-osrm.org/route/v1/driving/";

    /**
     * Calculates distance between two points using OSRM
     * @param src Source point
     * @param dest Destination point
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

            return response.getRoutes().get(0).getDistance() / 1000.0; // Convert meters to km
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