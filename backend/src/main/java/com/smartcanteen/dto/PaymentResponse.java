package com.smartcanteen.dto;

import com.smartcanteen.model.PaymentStatus;

public class PaymentResponse {
    private String paymentId;
    private String orderId;
    private String razorpayOrderId;
    private double amount;
    private String currency;
    private String keyId;
    private PaymentStatus status;
    private String tokenNumber;
    private String qrCodeIdentifier;
    private String qrCodePayload;
    private boolean isDemoPayment;

    public PaymentResponse() {}

    public PaymentResponse(String paymentId, String orderId, String razorpayOrderId, double amount, String currency, String keyId, PaymentStatus status, String tokenNumber, String qrCodeIdentifier, String qrCodePayload, boolean isDemoPayment) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.currency = currency;
        this.keyId = keyId;
        this.status = status;
        this.tokenNumber = tokenNumber;
        this.qrCodeIdentifier = qrCodeIdentifier;
        this.qrCodePayload = qrCodePayload;
        this.isDemoPayment = isDemoPayment;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String paymentId;
        private String orderId;
        private String razorpayOrderId;
        private double amount;
        private String currency;
        private String keyId;
        private PaymentStatus status;
        private String tokenNumber;
        private String qrCodeIdentifier;
        private String qrCodePayload;
        private boolean isDemoPayment;

        public Builder paymentId(String paymentId) { this.paymentId = paymentId; return this; }
        public Builder orderId(String orderId) { this.orderId = orderId; return this; }
        public Builder razorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; return this; }
        public Builder amount(double amount) { this.amount = amount; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder keyId(String keyId) { this.keyId = keyId; return this; }
        public Builder status(PaymentStatus status) { this.status = status; return this; }
        public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder qrCodeIdentifier(String qrCodeIdentifier) { this.qrCodeIdentifier = qrCodeIdentifier; return this; }
        public Builder qrCodePayload(String qrCodePayload) { this.qrCodePayload = qrCodePayload; return this; }
        public Builder isDemoPayment(boolean isDemoPayment) { this.isDemoPayment = isDemoPayment; return this; }

        public PaymentResponse build() {
            return new PaymentResponse(paymentId, orderId, razorpayOrderId, amount, currency, keyId, status, tokenNumber, qrCodeIdentifier, qrCodePayload, isDemoPayment);
        }
    }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }
    public String getQrCodeIdentifier() { return qrCodeIdentifier; }
    public void setQrCodeIdentifier(String qrCodeIdentifier) { this.qrCodeIdentifier = qrCodeIdentifier; }
    public String getQrCodePayload() { return qrCodePayload; }
    public void setQrCodePayload(String qrCodePayload) { this.qrCodePayload = qrCodePayload; }
    public boolean isDemoPayment() { return isDemoPayment; }
    public void setDemoPayment(boolean demoPayment) { isDemoPayment = demoPayment; }
}
