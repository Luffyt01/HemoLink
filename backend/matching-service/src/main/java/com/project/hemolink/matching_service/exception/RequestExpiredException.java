package com.project.hemolink.matching_service.exception;

public class RequestExpiredException extends RuntimeException {
    public RequestExpiredException(String message) {
        super(message);
    }
}
