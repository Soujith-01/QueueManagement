package com.smartcanteen.model;

public class OrderItem {
    private String foodId;
    private String foodName;
    private String image;
    private double price;
    private int quantity;
    private boolean isVeg;
    private double subtotal;

    public OrderItem() {}

    public OrderItem(String foodId, String foodName, String image, double price, int quantity, boolean isVeg, double subtotal) {
        this.foodId = foodId;
        this.foodName = foodName;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
        this.isVeg = isVeg;
        this.subtotal = subtotal;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String foodId;
        private String foodName;
        private String image;
        private double price;
        private int quantity;
        private boolean isVeg;
        private double subtotal;

        public Builder foodId(String foodId) { this.foodId = foodId; return this; }
        public Builder foodName(String foodName) { this.foodName = foodName; return this; }
        public Builder image(String image) { this.image = image; return this; }
        public Builder price(double price) { this.price = price; return this; }
        public Builder quantity(int quantity) { this.quantity = quantity; return this; }
        public Builder isVeg(boolean isVeg) { this.isVeg = isVeg; return this; }
        public Builder subtotal(double subtotal) { this.subtotal = subtotal; return this; }

        public OrderItem build() {
            return new OrderItem(foodId, foodName, image, price, quantity, isVeg, subtotal);
        }
    }

    public String getFoodId() { return foodId; }
    public void setFoodId(String foodId) { this.foodId = foodId; }
    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    @com.fasterxml.jackson.annotation.JsonProperty("isVeg")
    public boolean getIsVeg() { return isVeg; }
    public void setIsVeg(boolean isVeg) { this.isVeg = isVeg; }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean veg) { this.isVeg = veg; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
}
