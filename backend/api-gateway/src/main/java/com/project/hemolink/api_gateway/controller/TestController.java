package com.project.hemolink.api_gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/index.html")
    public String hello(){
        return "WELCOME TO HEMOLINK";
    }
}
