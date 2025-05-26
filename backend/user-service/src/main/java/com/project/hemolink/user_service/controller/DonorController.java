package com.project.hemolink.user_service.controller;

import com.project.hemolink.user_service.dto.*;
import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.enums.BloodType;
import com.project.hemolink.user_service.exception.BadRequestException;
import com.project.hemolink.user_service.services.DonorService;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/donors")
@PreAuthorize("hasRole('DONOR')")
@RequiredArgsConstructor
public class DonorController {
    private final DonorService donorService;
    private final ModelMapper modelMapper;


    @PostMapping("/completeProfile")
    public ResponseEntity<DonorDto> completeProfile(@RequestBody CompleteDonorProfileDto completeDonorProfileDto){
        return ResponseEntity.ok(donorService.completeProfile(completeDonorProfileDto));
    }

    @PatchMapping("/availability")
    public ResponseEntity<DonorDto> updateAvailability(@RequestBody AvailabilityDto availabilityDto){
        return ResponseEntity.ok(donorService.updateAvailability(availabilityDto));
    }

    @PatchMapping("/updateLocation")
    public ResponseEntity<DonorDto> updateLocation(@RequestBody LocationDto locationDto){
        return ResponseEntity.ok(donorService.updateLocation(locationDto.getLocation()));
    }

    @GetMapping("/{donorId}")
    public DonorDto getDonor(@PathVariable String donorId){
        return donorService.findDonorById(donorId);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<DonorDto> getDonorByUserId(@PathVariable String userId){
        return ResponseEntity.ok(donorService.getDonorByUserId(userId));
    }

    @GetMapping("/eligible")
    public ResponseEntity<List<DonorMatchDto>> findNearByEligibleDonors(
            @RequestParam String location,  // format: "lon,lat"
            @RequestParam BloodType bloodType,
            @RequestParam(defaultValue = "50") int radiusKm,
            @RequestParam(defaultValue = "10") int limit) {

        try {
            String[] coords = location.split(",");
            double lon = Double.parseDouble(coords[0]);
            double lat = Double.parseDouble(coords[1]);

            PointDTO pointDTO = new PointDTO(new double[]{lon, lat});
            Point point = modelMapper.map(pointDTO, Point.class);

            return ResponseEntity.ok(
                    donorService.findNearByEligibleDonors(point, bloodType, radiusKm, limit)
            );
        } catch (Exception e) {
            throw new BadRequestException("Invalid location format. Use 'longitude,latitude'");
        }
    }
}
