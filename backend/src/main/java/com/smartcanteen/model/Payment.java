package com.smartcanteen.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    @Indexed
    private String orderId;
    private String userId;

    @Indexed
    private String razorpayOrderId;

    @Indexed
    private String razorpayPaymentId;
    private String razorpaySignature;
    private double amount;
    private String currency;
    private PaymentStatus status = PaymentStatus.PENDING;
    private String paymentMethod;
    private String failureReason;
    private String refundId;
    private Instant refundedAt;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Payment() {}

    public Payment(String id, String orderId, String userId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature, double amount, String currency, PaymentStatus status, String paymentMethod, String failureReason, String refundId, Instant refundedAt, Instant createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.userId = userId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
        this.amount = amount;
        this.currency = currency;
        this.status = status != null ? status : PaymentStatus.PENDING;
        this.paymentMethod = paymentMethod;
        this.failureReason = failureReason;
        this.refundId = refundId;
        this.refundedAt = refundedAt;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String orderId;
        private String userId;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;
        private double amount;
        private String currency;
        private PaymentStatus status = PaymentStatus.PENDING;
        private String paymentMethod;
        private String failureReason;
        private String refundId;
        private Instant refundedAt;
        private Instant createdAt = Instant.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder orderId(String orderId) { this.orderId = orderId; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder razorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; return this; }
        public Builder razorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; return this; }
        public Builder razorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; return this; }
        public Builder amount(double amount) { this.amount = amount; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder status(PaymentStatus status) { this.status = status; return this; }
        public Builder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public Builder failureReason(String failureReason) { this.failureReason = failureReason; return this; }
        public Builder refundId(String refundId) { this.refundId = refundId; return this; }
        public Builder refundedAt(Instant refundedAt) { this.refundedAt = refundedAt; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Payment build() {
            return new Payment(id, orderId, userId, razorpayOrderId, razorpayPaymentId, razorpaySignature, amount, currency, status, paymentMethod, failureReason, refundId, refundedAt, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
    public String getRefundId() { return refundId; }
    public void setRefundId(String refundId) { this.refundId = refundId; }
    public Instant getRefundedAt() { return refundedAt; }
    public void setRefundedAt(Instant refundedAt) { this.refundedAt = refundedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
