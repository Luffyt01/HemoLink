package com.project.hemolink.user_service.repositories;

import com.project.hemolink.user_service.entities.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DonorRepository extends JpaRepository<Donor, UUID> {
}
