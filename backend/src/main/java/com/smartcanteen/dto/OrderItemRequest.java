package com.smartcanteen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class OrderItemRequest {
    @NotBlank(message = "Food ID is required")
    private String foodId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    public OrderItemRequest() {}

    public OrderItemRequest(String foodId, int quantity) {
        this.foodId = foodId;
        this.quantity = quantity;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String foodId;
        private int quantity;

        public Builder foodId(String foodId) { this.foodId = foodId; return this; }
        public Builder quantity(int quantity) { this.quantity = quantity; return this; }

        public OrderItemRequest build() {
            return new OrderItemRequest(foodId, quantity);
        }
    }

    public String getFoodId() { return foodId; }
    public void setFoodId(String foodId) { this.foodId = foodId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
