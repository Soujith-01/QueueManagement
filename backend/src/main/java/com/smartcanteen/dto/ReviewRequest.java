package com.smartcanteen.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ReviewRequest {
    @NotBlank(message = "Food ID is required")
    private String foodId;

    private String orderId;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private int rating;

    @Min(value = 0, message = "Wait time rating must be between 0 and 5")
    @Max(value = 5, message = "Wait time rating must be between 0 and 5")
    private int waitTimeRating = 5;

    private String comment;

    public ReviewRequest() {}

    public ReviewRequest(String foodId, String orderId, int rating, int waitTimeRating, String comment) {
        this.foodId = foodId;
        this.orderId = orderId;
        this.rating = rating;
        this.waitTimeRating = waitTimeRating;
        this.comment = comment;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String foodId;
        private String orderId;
        private int rating;
        private int waitTimeRating;
        private String comment;

        public Builder foodId(String foodId) { this.foodId = foodId; return this; }
        public Builder orderId(String orderId) { this.orderId = orderId; return this; }
        public Builder rating(int rating) { this.rating = rating; return this; }
        public Builder waitTimeRating(int waitTimeRating) { this.waitTimeRating = waitTimeRating; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }

        public ReviewRequest build() {
            return new ReviewRequest(foodId, orderId, rating, waitTimeRating, comment);
        }
    }

    public String getFoodId() { return foodId; }
    public void setFoodId(String foodId) { this.foodId = foodId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public int getWaitTimeRating() { return waitTimeRating; }
    public void setWaitTimeRating(int waitTimeRating) { this.waitTimeRating = waitTimeRating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
