package com.project.hemolink.matching_service.exception;

import com.fasterxml.jackson.core.JsonParseException;

public class InvalidJsonInputException extends JsonParseException {
    public InvalidJsonInputException(String msg) {
        super(msg);
    }
}
