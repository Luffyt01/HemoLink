package com.project.hemolink.notification_service.services;

import com.project.hemolink.notification_service.entity.Notification;
import com.project.hemolink.notification_service.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;


    @Transactional
    public void sendNotification(UUID userId, String message){
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setUserId(userId);
        notification.setRead(false);
        notificationRepository.save(notification);

        log.info("Notification saved for user: {}", userId);
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
