package com.project.hemolink.matching_service.security;


import com.project.hemolink.matching_service.dto.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityUtil {

    public UUID getCurrentUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()){
            return UUID.fromString((String) authentication.getPrincipal());
        }
        throw new RuntimeException("No authenticated user found");
    }
}
