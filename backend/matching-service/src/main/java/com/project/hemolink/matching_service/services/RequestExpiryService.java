package com.project.hemolink.matching_service.services;

import com.project.hemolink.matching_service.entities.BloodRequest;
import com.project.hemolink.matching_service.entities.enums.RequestStatus;
import com.project.hemolink.matching_service.repositories.BloodRequestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for handling request expiry
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class RequestExpiryService {
    private final BloodRequestRepository bloodRequestRepository;

    /**
     * Scheduled task to expire old requests (runs every 5 minutes)
     */
    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void expireOldRequests() {
        LocalDateTime now = LocalDateTime.now();
        List<BloodRequest> expiredRequests = bloodRequestRepository
                .findByStatusAndExpiryTimeBefore(RequestStatus.PENDING, now);

        if (!expiredRequests.isEmpty()) {
            log.info("Expiring {} requests", expiredRequests.size());
            expiredRequests.forEach(request -> request.setStatus(RequestStatus.EXPIRED));
            bloodRequestRepository.saveAll(expiredRequests);
        }
    }
}