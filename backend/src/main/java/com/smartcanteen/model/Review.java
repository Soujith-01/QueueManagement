package com.smartcanteen.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    @Indexed
    private String foodId;
    private String foodName;
    private String orderId;
    private String userId;
    private String userName;
    private Role userRole;
    private int rating;
    private int waitTimeRating;
    private String comment;
    private boolean isApproved = true;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Review() {}

    public Review(String id, String foodId, String foodName, String orderId, String userId, String userName, Role userRole, int rating, int waitTimeRating, String comment, boolean isApproved, Instant createdAt) {
        this.id = id;
        this.foodId = foodId;
        this.foodName = foodName;
        this.orderId = orderId;
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
        this.rating = rating;
        this.waitTimeRating = waitTimeRating;
        this.comment = comment;
        this.isApproved = isApproved;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String foodId;
        private String foodName;
        private String orderId;
        private String userId;
        private String userName;
        private Role userRole;
        private int rating;
        private int waitTimeRating;
        private String comment;
        private boolean isApproved = true;
        private Instant createdAt = Instant.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder foodId(String foodId) { this.foodId = foodId; return this; }
        public Builder foodName(String foodName) { this.foodName = foodName; return this; }
        public Builder orderId(String orderId) { this.orderId = orderId; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder userName(String userName) { this.userName = userName; return this; }
        public Builder userRole(Role userRole) { this.userRole = userRole; return this; }
        public Builder rating(int rating) { this.rating = rating; return this; }
        public Builder waitTimeRating(int waitTimeRating) { this.waitTimeRating = waitTimeRating; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }
        public Builder isApproved(boolean isApproved) { this.isApproved = isApproved; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Review build() {
            return new Review(id, foodId, foodName, orderId, userId, userName, userRole, rating, waitTimeRating, comment, isApproved, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFoodId() { return foodId; }
    public void setFoodId(String foodId) { this.foodId = foodId; }
    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Role getUserRole() { return userRole; }
    public void setUserRole(Role userRole) { this.userRole = userRole; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public int getWaitTimeRating() { return waitTimeRating; }
    public void setWaitTimeRating(int waitTimeRating) { this.waitTimeRating = waitTimeRating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public boolean isApproved() { return isApproved; }
    public void setApproved(boolean approved) { isApproved = approved; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
