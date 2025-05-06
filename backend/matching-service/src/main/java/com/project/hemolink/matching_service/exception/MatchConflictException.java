package com.project.hemolink.matching_service.exception;

public class MatchConflictException extends RuntimeException {
    public MatchConflictException(String message) {
        super(message);
    }
}
