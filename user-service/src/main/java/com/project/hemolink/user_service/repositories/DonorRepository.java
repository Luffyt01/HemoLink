package com.project.hemolink.user_service.repositories;

import com.project.hemolink.user_service.entities.Donor;
import com.project.hemolink.user_service.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DonorRepository extends JpaRepository<Donor, UUID> {

    Optional<Donor> findByUser(User user);
    void deleteByUser(User user);
}
