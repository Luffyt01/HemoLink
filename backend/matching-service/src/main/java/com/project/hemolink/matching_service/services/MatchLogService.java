package com.project.hemolink.matching_service.services;

import com.project.hemolink.matching_service.dto.MatchLogDto;
import com.project.hemolink.matching_service.entities.MatchLog;
import com.project.hemolink.matching_service.entities.enums.NotificationStatus;
import com.project.hemolink.matching_service.exception.ResourceNotFoundException;
import com.project.hemolink.matching_service.repositories.MatchLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class MatchLogService {

    private final MatchLogRepository matchLogRepository;
    private final ModelMapper modelMapper;

    public void logMatch(String requestId, String donorId){
        log.info("Attempting to create log for request: {} and donor: {}", requestId, donorId);
        MatchLog log = new MatchLog();

        log.setRequestId(requestId);
        log.setDonorId(donorId);
        log.setMatchedAt(LocalDateTime.now());
        log.setStatus(NotificationStatus.PENDING);
        matchLogRepository.save(log);
    }

    public List<MatchLogDto> getPendingNotifications(){
        List<MatchLog> matchLogs = matchLogRepository.findByStatus(NotificationStatus.PENDING);
        if (matchLogs.isEmpty()){
            throw new ResourceNotFoundException("No pending notification found");
        }

        return matchLogs.stream()
                .map(matchLog -> modelMapper.map(matchLog, MatchLogDto.class))
                .toList();
    }

    @Transactional
    public void markNotificationSent(String matchId){
        MatchLog log = matchLogRepository.findById(UUID.fromString(matchId))
                .orElseThrow(() -> new ResourceNotFoundException("Match log not found for id: "+matchId));

        log.setStatus(NotificationStatus.SENT);
        matchLogRepository.save(log);
    }

    public List<MatchLog> getLogsForRequest(String requestIdStr) {
        return matchLogRepository.findByRequestIdAndStatus(requestIdStr, NotificationStatus.PENDING);
    }
}
