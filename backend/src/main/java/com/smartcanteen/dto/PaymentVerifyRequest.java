package com.smartcanteen.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentVerifyRequest {
    @NotBlank(message = "Order ID is required")
    private String orderId;

    @NotBlank(message = "Razorpay Order ID is required")
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay Payment ID is required")
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay Signature is required")
    private String razorpaySignature;

    public PaymentVerifyRequest() {}

    public PaymentVerifyRequest(String orderId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        this.orderId = orderId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String orderId;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;

        public Builder orderId(String orderId) { this.orderId = orderId; return this; }
        public Builder razorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; return this; }
        public Builder razorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; return this; }
        public Builder razorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; return this; }

        public PaymentVerifyRequest build() {
            return new PaymentVerifyRequest(orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature);
        }
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }
}
