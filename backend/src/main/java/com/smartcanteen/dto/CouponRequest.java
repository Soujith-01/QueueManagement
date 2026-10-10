package com.smartcanteen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.time.Instant;

public class CouponRequest {
    @NotBlank(message = "Coupon code is required")
    private String code;

    private String description;

    @NotBlank(message = "Discount type (PERCENTAGE/FIXED) is required")
    private String discountType;

    @Positive(message = "Discount value must be positive")
    private double discountValue;

    private double minimumOrder;
    private double maximumDiscount;
    private Instant expiryDate;
    private Integer usageLimit;
    private Boolean active;

    public CouponRequest() {}

    public CouponRequest(String code, String description, String discountType, double discountValue, double minimumOrder, double maximumDiscount, Instant expiryDate, Integer usageLimit, Boolean active) {
        this.code = code;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minimumOrder = minimumOrder;
        this.maximumDiscount = maximumDiscount;
        this.expiryDate = expiryDate;
        this.usageLimit = usageLimit;
        this.active = active;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String code;
        private String description;
        private String discountType;
        private double discountValue;
        private double minimumOrder;
        private double maximumDiscount;
        private Instant expiryDate;
        private Integer usageLimit;
        private Boolean active;

        public Builder code(String code) { this.code = code; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder discountType(String discountType) { this.discountType = discountType; return this; }
        public Builder discountValue(double discountValue) { this.discountValue = discountValue; return this; }
        public Builder minimumOrder(double minimumOrder) { this.minimumOrder = minimumOrder; return this; }
        public Builder maximumDiscount(double maximumDiscount) { this.maximumDiscount = maximumDiscount; return this; }
        public Builder expiryDate(Instant expiryDate) { this.expiryDate = expiryDate; return this; }
        public Builder usageLimit(Integer usageLimit) { this.usageLimit = usageLimit; return this; }
        public Builder active(Boolean active) { this.active = active; return this; }

        public CouponRequest build() {
            return new CouponRequest(code, description, discountType, discountValue, minimumOrder, maximumDiscount, expiryDate, usageLimit, active);
        }
    }

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
    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
