package com.smartcanteen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class CouponApplyDTO {

    public static class Request {
        @NotBlank(message = "Coupon code is required")
        private String code;

        @Positive(message = "Subtotal must be positive")
        private double subtotal;

        public Request() {}

        public Request(String code, double subtotal) {
            this.code = code;
            this.subtotal = subtotal;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public double getSubtotal() { return subtotal; }
        public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    }

    public static class Response {
        private boolean valid;
        private String code;
        private double discountAmount;
        private double finalSubtotal;
        private String message;

        public Response() {}

        public Response(boolean valid, String code, double discountAmount, double finalSubtotal, String message) {
            this.valid = valid;
            this.code = code;
            this.discountAmount = discountAmount;
            this.finalSubtotal = finalSubtotal;
            this.message = message;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private boolean valid;
            private String code;
            private double discountAmount;
            private double finalSubtotal;
            private String message;

            public Builder valid(boolean valid) { this.valid = valid; return this; }
            public Builder code(String code) { this.code = code; return this; }
            public Builder discountAmount(double discountAmount) { this.discountAmount = discountAmount; return this; }
            public Builder finalSubtotal(double finalSubtotal) { this.finalSubtotal = finalSubtotal; return this; }
            public Builder message(String message) { this.message = message; return this; }

            public Response build() {
                return new Response(valid, code, discountAmount, finalSubtotal, message);
            }
        }

        public boolean isValid() { return valid; }
        public void setValid(boolean valid) { this.valid = valid; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public double getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(double discountAmount) { this.discountAmount = discountAmount; }
        public double getFinalSubtotal() { return finalSubtotal; }
        public void setFinalSubtotal(double finalSubtotal) { this.finalSubtotal = finalSubtotal; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
