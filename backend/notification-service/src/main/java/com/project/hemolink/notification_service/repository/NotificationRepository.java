package com.project.hemolink.notification_service.repository;

import com.project.hemolink.notification_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long > {
}