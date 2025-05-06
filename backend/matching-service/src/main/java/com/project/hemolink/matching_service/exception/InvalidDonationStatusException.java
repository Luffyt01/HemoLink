package com.project.hemolink.matching_service.exception;

public class InvalidDonationStatusException extends RuntimeException {
    public InvalidDonationStatusException(String message) {
        super(message);
    }
}
