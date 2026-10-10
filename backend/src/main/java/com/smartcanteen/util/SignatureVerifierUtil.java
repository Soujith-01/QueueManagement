package com.smartcanteen.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class SignatureVerifierUtil {

    private static final Logger log = LoggerFactory.getLogger(SignatureVerifierUtil.class);

    public static boolean verifyRazorpaySignature(String orderId, String paymentId, String actualSignature, String secret) {
        if (orderId == null || paymentId == null || actualSignature == null || secret == null) {
            return false;
        }

        try {
            String payload = orderId + "|" + paymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            String expectedSignature = hexString.toString();
            return MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), actualSignature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Error verifying Razorpay signature: {}", e.getMessage());
            return false;
        }
    }
}
