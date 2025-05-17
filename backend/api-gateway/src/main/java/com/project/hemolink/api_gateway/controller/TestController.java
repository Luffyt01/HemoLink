package com.project.hemolink.api_gateway.controller;

import com.project.hemolink.api_gateway.dto.OutputDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public ResponseEntity<OutputDto> hello(){
        return ResponseEntity.ok(new OutputDto());
    }
}
