package com.project.hemolink.user_service.utils;

import com.project.hemolink.user_service.entities.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityUtil {

    public UUID getCurrentUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()){
            User user = (User) authentication.getPrincipal();
            return user.getId();
        }
        throw new RuntimeException("No authenticated user found");
    }
}
