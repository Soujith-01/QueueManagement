package com.smartcanteen.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @Indexed(unique = true)
    private String orderNumber;

    private String userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private Role userRole;

    private List<OrderItem> items = new ArrayList<>();
    private double subtotal;
    private double discount = 0.0;
    private String couponCode;
    private double tax = 0.0;
    private double finalAmount;

    private String paymentId;
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Indexed
    private String tokenNumber;

    @Indexed(unique = true)
    private String qrCodeIdentifier;

    private String qrCodePayload;
    private String pickupSlotId;
    private String pickupSlotTime;
    private String pickupSlotDate;

    private OrderStatus status = OrderStatus.PLACED;
    private int queuePosition = 0;
    private Instant estimatedReadyTime;

    private Instant acceptedAt;
    private Instant preparingAt;
    private Instant readyAt;
    private Instant collectedAt;
    private Instant cancelledAt;
    private String cancellationReason;

    private Integer rating;
    private String reviewComment;
    private String notes;

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public Order() {}

    public Order(String id, String orderNumber, String userId, String userName, String userEmail, String userPhone, Role userRole, List<OrderItem> items, double subtotal, double discount, String couponCode, double tax, double finalAmount, String paymentId, PaymentStatus paymentStatus, String tokenNumber, String qrCodeIdentifier, String qrCodePayload, String pickupSlotId, String pickupSlotTime, String pickupSlotDate, OrderStatus status, int queuePosition, Instant estimatedReadyTime, Instant acceptedAt, Instant preparingAt, Instant readyAt, Instant collectedAt, Instant cancelledAt, String cancellationReason, Integer rating, String reviewComment, String notes, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.userRole = userRole;
        this.items = items != null ? items : new ArrayList<>();
        this.subtotal = subtotal;
        this.discount = discount;
        this.couponCode = couponCode;
        this.tax = tax;
        this.finalAmount = finalAmount;
        this.paymentId = paymentId;
        this.paymentStatus = paymentStatus != null ? paymentStatus : PaymentStatus.PENDING;
        this.tokenNumber = tokenNumber;
        this.qrCodeIdentifier = qrCodeIdentifier;
        this.qrCodePayload = qrCodePayload;
        this.pickupSlotId = pickupSlotId;
        this.pickupSlotTime = pickupSlotTime;
        this.pickupSlotDate = pickupSlotDate;
        this.status = status != null ? status : OrderStatus.PLACED;
        this.queuePosition = queuePosition;
        this.estimatedReadyTime = estimatedReadyTime;
        this.acceptedAt = acceptedAt;
        this.preparingAt = preparingAt;
        this.readyAt = readyAt;
        this.collectedAt = collectedAt;
        this.cancelledAt = cancelledAt;
        this.cancellationReason = cancellationReason;
        this.rating = rating;
        this.reviewComment = reviewComment;
        this.notes = notes;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String orderNumber;
        private String userId;
        private String userName;
        private String userEmail;
        private String userPhone;
        private Role userRole;
        private List<OrderItem> items = new ArrayList<>();
        private double subtotal;
        private double discount = 0.0;
        private String couponCode;
        private double tax = 0.0;
        private double finalAmount;
        private String paymentId;
        private PaymentStatus paymentStatus = PaymentStatus.PENDING;
        private String tokenNumber;
        private String qrCodeIdentifier;
        private String qrCodePayload;
        private String pickupSlotId;
        private String pickupSlotTime;
        private String pickupSlotDate;
        private OrderStatus status = OrderStatus.PLACED;
        private int queuePosition = 0;
        private Instant estimatedReadyTime;
        private Instant acceptedAt;
        private Instant preparingAt;
        private Instant readyAt;
        private Instant collectedAt;
        private Instant cancelledAt;
        private String cancellationReason;
        private Integer rating;
        private String reviewComment;
        private String notes;
        private Instant createdAt = Instant.now();
        private Instant updatedAt = Instant.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder orderNumber(String orderNumber) { this.orderNumber = orderNumber; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder userName(String userName) { this.userName = userName; return this; }
        public Builder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public Builder userPhone(String userPhone) { this.userPhone = userPhone; return this; }
        public Builder userRole(Role userRole) { this.userRole = userRole; return this; }
        public Builder items(List<OrderItem> items) { this.items = items; return this; }
        public Builder subtotal(double subtotal) { this.subtotal = subtotal; return this; }
        public Builder discount(double discount) { this.discount = discount; return this; }
        public Builder couponCode(String couponCode) { this.couponCode = couponCode; return this; }
        public Builder tax(double tax) { this.tax = tax; return this; }
        public Builder finalAmount(double finalAmount) { this.finalAmount = finalAmount; return this; }
        public Builder paymentId(String paymentId) { this.paymentId = paymentId; return this; }
        public Builder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder qrCodeIdentifier(String qrCodeIdentifier) { this.qrCodeIdentifier = qrCodeIdentifier; return this; }
        public Builder qrCodePayload(String qrCodePayload) { this.qrCodePayload = qrCodePayload; return this; }
        public Builder pickupSlotId(String pickupSlotId) { this.pickupSlotId = pickupSlotId; return this; }
        public Builder pickupSlotTime(String pickupSlotTime) { this.pickupSlotTime = pickupSlotTime; return this; }
        public Builder pickupSlotDate(String pickupSlotDate) { this.pickupSlotDate = pickupSlotDate; return this; }
        public Builder status(OrderStatus status) { this.status = status; return this; }
        public Builder queuePosition(int queuePosition) { this.queuePosition = queuePosition; return this; }
        public Builder estimatedReadyTime(Instant estimatedReadyTime) { this.estimatedReadyTime = estimatedReadyTime; return this; }
        public Builder acceptedAt(Instant acceptedAt) { this.acceptedAt = acceptedAt; return this; }
        public Builder preparingAt(Instant preparingAt) { this.preparingAt = preparingAt; return this; }
        public Builder readyAt(Instant readyAt) { this.readyAt = readyAt; return this; }
        public Builder collectedAt(Instant collectedAt) { this.collectedAt = collectedAt; return this; }
        public Builder cancelledAt(Instant cancelledAt) { this.cancelledAt = cancelledAt; return this; }
        public Builder cancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; return this; }
        public Builder rating(Integer rating) { this.rating = rating; return this; }
        public Builder reviewComment(String reviewComment) { this.reviewComment = reviewComment; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Order build() {
            return new Order(id, orderNumber, userId, userName, userEmail, userPhone, userRole, items, subtotal, discount, couponCode, tax, finalAmount, paymentId, paymentStatus, tokenNumber, qrCodeIdentifier, qrCodePayload, pickupSlotId, pickupSlotTime, pickupSlotDate, status, queuePosition, estimatedReadyTime, acceptedAt, preparingAt, readyAt, collectedAt, cancelledAt, cancellationReason, rating, reviewComment, notes, createdAt, updatedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }
    public Role getUserRole() { return userRole; }
    public void setUserRole(Role userRole) { this.userRole = userRole; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
    public double getTax() { return tax; }
    public void setTax(double tax) { this.tax = tax; }
    public double getFinalAmount() { return finalAmount; }
    public void setFinalAmount(double finalAmount) { this.finalAmount = finalAmount; }
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    @com.fasterxml.jackson.annotation.JsonProperty("tokenNumber")
    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    @com.fasterxml.jackson.annotation.JsonProperty("token")
    public String getToken() { return tokenNumber; }
    public String getQrCodeIdentifier() { return qrCodeIdentifier; }
    public void setQrCodeIdentifier(String qrCodeIdentifier) { this.qrCodeIdentifier = qrCodeIdentifier; }
    public String getQrCodePayload() { return qrCodePayload; }
    public void setQrCodePayload(String qrCodePayload) { this.qrCodePayload = qrCodePayload; }
    public String getPickupSlotId() { return pickupSlotId; }
    public void setPickupSlotId(String pickupSlotId) { this.pickupSlotId = pickupSlotId; }
    public String getPickupSlotTime() { return pickupSlotTime; }
    public void setPickupSlotTime(String pickupSlotTime) { this.pickupSlotTime = pickupSlotTime; }
    public String getPickupSlotDate() { return pickupSlotDate; }
    public void setPickupSlotDate(String pickupSlotDate) { this.pickupSlotDate = pickupSlotDate; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public int getQueuePosition() { return queuePosition; }
    public void setQueuePosition(int queuePosition) { this.queuePosition = queuePosition; }
    public Instant getEstimatedReadyTime() { return estimatedReadyTime; }
    public void setEstimatedReadyTime(Instant estimatedReadyTime) { this.estimatedReadyTime = estimatedReadyTime; }
    public Instant getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(Instant acceptedAt) { this.acceptedAt = acceptedAt; }
    public Instant getPreparingAt() { return preparingAt; }
    public void setPreparingAt(Instant preparingAt) { this.preparingAt = preparingAt; }
    public Instant getReadyAt() { return readyAt; }
    public void setReadyAt(Instant readyAt) { this.readyAt = readyAt; }
    public Instant getCollectedAt() { return collectedAt; }
    public void setCollectedAt(Instant collectedAt) { this.collectedAt = collectedAt; }
    public Instant getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(Instant cancelledAt) { this.cancelledAt = cancelledAt; }
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getReviewComment() { return reviewComment; }
    public void setReviewComment(String reviewComment) { this.reviewComment = reviewComment; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
