package com.project.hemolink.matching_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MatchingServiceApplication {


	public static void main(String[] args) {
		SpringApplication.run(MatchingServiceApplication.class, args);
	}

}
