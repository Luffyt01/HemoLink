package com.project.hemolink.user_service.exception;

import com.fasterxml.jackson.core.JsonParseException;

public class InvalidJsonInputException extends JsonParseException {
    public InvalidJsonInputException(String msg) {
        super(msg);
    }
}
