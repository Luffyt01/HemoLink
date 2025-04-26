package com.project.hemolink.matching_service.controller;

import com.project.hemolink.matching_service.dto.MatchLogDto;
import com.project.hemolink.matching_service.services.MatchLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/match-logs")
@RequiredArgsConstructor
public class MatchLogController {
    private final MatchLogService matchLogService;

    @GetMapping("/pending")
    public ResponseEntity<List<MatchLogDto>> getPendingNotifications() {
        return ResponseEntity.ok(matchLogService.getPendingNotifications());
    }

    @PatchMapping("/{matchId}/mark-sent")
    public ResponseEntity<Void> markNotificationSent(
            @PathVariable String matchId) {
        matchLogService.markNotificationSent(matchId);
        return ResponseEntity.noContent().build();
    }

}
