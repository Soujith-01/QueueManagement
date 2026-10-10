package com.smartcanteen.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @Indexed
    private String userId;
    private String title;
    private String message;
    private String type;
    private String orderId;
    private String tokenNumber;
    private boolean isRead = false;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Notification() {}

    public Notification(String id, String userId, String title, String message, String type, String orderId, String tokenNumber, boolean isRead, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.orderId = orderId;
        this.tokenNumber = tokenNumber;
        this.isRead = isRead;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String userId;
        private String title;
        private String message;
        private String type;
        private String orderId;
        private String tokenNumber;
        private boolean isRead = false;
        private Instant createdAt = Instant.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder orderId(String orderId) { this.orderId = orderId; return this; }
        public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder isRead(boolean isRead) { this.isRead = isRead; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Notification build() {
            return new Notification(id, userId, title, message, type, orderId, tokenNumber, isRead, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }
    @com.fasterxml.jackson.annotation.JsonProperty("isRead")
    public boolean getIsRead() { return isRead; }

    @com.fasterxml.jackson.annotation.JsonProperty("read")
    public boolean isRead() { return isRead; }

    public void setRead(boolean read) { isRead = read; }
    public void setIsRead(boolean read) { isRead = read; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
