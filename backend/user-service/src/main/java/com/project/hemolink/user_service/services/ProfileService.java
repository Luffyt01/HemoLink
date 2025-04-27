package com.project.hemolink.user_service.services;

import com.project.hemolink.user_service.auth.UserContextHolder;
import com.project.hemolink.user_service.dto.DonorDto;
import com.project.hemolink.user_service.dto.HospitalDto;
import com.project.hemolink.user_service.dto.UserDto;
import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.Hospital;
import com.project.hemolink.user_service.entities.User;
import com.project.hemolink.user_service.entities.enums.UserRole;
import com.project.hemolink.user_service.exception.ResourceNotFoundException;
import com.project.hemolink.user_service.repositories.DonorRepository;
import com.project.hemolink.user_service.repositories.HospitalRepository;
import com.project.hemolink.user_service.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final ModelMapper modelMapper;

    public Object getCompleteProfile(){
        String userId = UserContextHolder.getCurrentUserId();
        User user = (User) userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: "+userId));

        UserRole role = user.getRole();

        log.info("Fetching profile for {} with email: {}", role.toString().toLowerCase(), user.getEmail());

        switch (role){
            case DONOR -> {
                return getDonorProfile(user);
            }
            case HOSPITAL -> {
                return getHospitalProfile(user);
            }
            default -> {
                return modelMapper.map(user, UserDto.class);
            }
        }
    }

    public DonorDto getDonorProfile(User user){
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: "+user.getEmail()));
        return modelMapper.map(donor, DonorDto.class);
    }

    public HospitalDto getHospitalProfile(User user){
        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: "+user.getEmail()));
        return modelMapper.map(hospital, HospitalDto.class);
    }

    public void deleteProfile() {
        String userId = UserContextHolder.getCurrentUserId();
        User user = (User) userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        UserRole role = user.getRole();

        log.info("Deleting profile for {} with email: {}", role.toString().toLowerCase(), user.getEmail());

        if (role.equals(UserRole.DONOR)){
            deleteDonorProfile(user);
        } else if (role.equals(UserRole.HOSPITAL)){
            deleteHospitalProfile(user);
        }

        userRepository.delete(user);

        log.info("Profile deleted successfully");
    }

    public void deleteDonorProfile(User user){
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: "+user.getEmail()));
        donorRepository.delete(donor);
    }
    public void deleteHospitalProfile(User user){
        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: "+user.getEmail()));
        hospitalRepository.delete(hospital);
    }
}
