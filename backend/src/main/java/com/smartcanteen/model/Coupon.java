package com.smartcanteen.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "coupons")
public class Coupon {

    @Id
    private String id;

    @Indexed(unique = true)
    private String code;
    private String description;
    private String discountType;
    private double discountValue;
    private double minimumOrder;
    private double maximumDiscount;
    private Instant expiryDate;
    private int usageLimit = 1000;
    private int usedCount = 0;
    private boolean active = true;

    public Coupon() {}

    public Coupon(String id, String code, String description, String discountType, double discountValue, double minimumOrder, double maximumDiscount, Instant expiryDate, int usageLimit, int usedCount, boolean active) {
        this.id = id;
        this.code = code;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minimumOrder = minimumOrder;
        this.maximumDiscount = maximumDiscount;
        this.expiryDate = expiryDate;
        this.usageLimit = usageLimit;
        this.usedCount = usedCount;
        this.active = active;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String code;
        private String description;
        private String discountType;
        private double discountValue;
        private double minimumOrder;
        private double maximumDiscount;
        private Instant expiryDate;
        private int usageLimit = 1000;
        private int usedCount = 0;
        private boolean active = true;

        public Builder id(String id) { this.id = id; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder discountType(String discountType) { this.discountType = discountType; return this; }
        public Builder discountValue(double discountValue) { this.discountValue = discountValue; return this; }
        public Builder minimumOrder(double minimumOrder) { this.minimumOrder = minimumOrder; return this; }
        public Builder maximumDiscount(double maximumDiscount) { this.maximumDiscount = maximumDiscount; return this; }
        public Builder expiryDate(Instant expiryDate) { this.expiryDate = expiryDate; return this; }
        public Builder usageLimit(int usageLimit) { this.usageLimit = usageLimit; return this; }
        public Builder usedCount(int usedCount) { this.usedCount = usedCount; return this; }
        public Builder active(boolean active) { this.active = active; return this; }

        public Coupon build() {
            return new Coupon(id, code, description, discountType, discountValue, minimumOrder, maximumDiscount, expiryDate, usageLimit, usedCount, active);
        }
    }

    public boolean isValid(double orderAmount) {
        if (!active) return false;
        if (expiryDate != null && Instant.now().isAfter(expiryDate)) return false;
        if (usedCount >= usageLimit) return false;
        return orderAmount >= minimumOrder;
    }

    public double calculateDiscount(double orderAmount) {
        if (!isValid(orderAmount)) return 0.0;
        double discount = 0.0;
        if ("PERCENTAGE".equalsIgnoreCase(discountType)) {
            discount = (orderAmount * discountValue) / 100.0;
            if (maximumDiscount > 0 && discount > maximumDiscount) {
                discount = maximumDiscount;
            }
        } else {
            discount = discountValue;
        }
        return Math.min(discount, orderAmount);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }
    public double getDiscountValue() { return discountValue; }
    public void setDiscountValue(double discountValue) { this.discountValue = discountValue; }
    public double getMinimumOrder() { return minimumOrder; }
    public void setMinimumOrder(double minimumOrder) { this.minimumOrder = minimumOrder; }
    public double getMaximumDiscount() { return maximumDiscount; }
    public void setMaximumDiscount(double maximumDiscount) { this.maximumDiscount = maximumDiscount; }
    public Instant getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Instant expiryDate) { this.expiryDate = expiryDate; }
    public int getUsageLimit() { return usageLimit; }
    public void setUsageLimit(int usageLimit) { this.usageLimit = usageLimit; }
    public int getUsedCount() { return usedCount; }
    public void setUsedCount(int usedCount) { this.usedCount = usedCount; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    public boolean getIsActive() { return active; }
}
