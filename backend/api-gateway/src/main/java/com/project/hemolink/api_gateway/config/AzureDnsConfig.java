package com.project.hemolink.api_gateway.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "spring.cloud.azure.private-dns")
@Getter
@Setter
public class AzureDnsConfig {
    private List<String> zones;
}
