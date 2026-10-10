package com.smartcanteen.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    private static final Logger log = LoggerFactory.getLogger(RazorpayConfig.class);

    @Value("${app.razorpay.key-id:rzp_test_college_canteen_dummy_key}")
    private String keyId;

    @Value("${app.razorpay.key-secret:rzp_test_secret_demo_12345}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() {
        try {
            return new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            log.warn("Razorpay client initialized with mock/fallback mode: {}", e.getMessage());
            return null;
        }
    }
}
