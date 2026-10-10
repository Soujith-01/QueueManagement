package com.smartcanteen.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class OrderCreateRequest {
    @NotEmpty(message = "Order must have at least one item")
    @Valid
    private List<OrderItemRequest> items;

    private String pickupSlotId;
    private String couponCode;
    private String notes;

    public OrderCreateRequest() {}

    public OrderCreateRequest(List<OrderItemRequest> items, String pickupSlotId, String couponCode, String notes) {
        this.items = items;
        this.pickupSlotId = pickupSlotId;
        this.couponCode = couponCode;
        this.notes = notes;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private List<OrderItemRequest> items;
        private String pickupSlotId;
        private String couponCode;
        private String notes;

        public Builder items(List<OrderItemRequest> items) { this.items = items; return this; }
        public Builder pickupSlotId(String pickupSlotId) { this.pickupSlotId = pickupSlotId; return this; }
        public Builder couponCode(String couponCode) { this.couponCode = couponCode; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }

        public OrderCreateRequest build() {
            return new OrderCreateRequest(items, pickupSlotId, couponCode, notes);
        }
    }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    public String getPickupSlotId() { return pickupSlotId; }
    public void setPickupSlotId(String pickupSlotId) { this.pickupSlotId = pickupSlotId; }
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
