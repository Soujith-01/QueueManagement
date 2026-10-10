package com.smartcanteen.dto;

import com.smartcanteen.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateRequest {
    @NotNull(message = "Order status is required")
    private OrderStatus status;
    private String reason;

    public OrderStatusUpdateRequest() {}

    public OrderStatusUpdateRequest(OrderStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private OrderStatus status;
        private String reason;

        public Builder status(OrderStatus status) { this.status = status; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }

        public OrderStatusUpdateRequest build() {
            return new OrderStatusUpdateRequest(status, reason);
        }
    }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
