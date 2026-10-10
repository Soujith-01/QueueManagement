package com.smartcanteen.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentCreateOrderRequest {
    @NotBlank(message = "Order ID is required")
    private String orderId;

    public PaymentCreateOrderRequest() {}

    public PaymentCreateOrderRequest(String orderId) {
        this.orderId = orderId;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String orderId;

        public Builder orderId(String orderId) { this.orderId = orderId; return this; }

        public PaymentCreateOrderRequest build() {
            return new PaymentCreateOrderRequest(orderId);
        }
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
}
