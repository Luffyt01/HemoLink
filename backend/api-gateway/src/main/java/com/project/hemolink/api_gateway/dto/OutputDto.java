package com.project.hemolink.api_gateway.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Data
@NoArgsConstructor
public class OutputDto {
    @Value("${user.endpoint}")
    private String userEndpoint;
    private String user_service_docs = userEndpoint+"/swagger-ui/index.html";


}
