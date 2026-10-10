package com.smartcanteen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.List;

public class FoodRequest {
    @NotBlank(message = "Food name is required")
    private String name;

    private String description;

    @Positive(message = "Price must be positive")
    private double price;

    @NotBlank(message = "Category is required")
    private String category;

    private String image;

    @Min(value = 0, message = "Stock cannot be negative")
    private int stock;

    @Min(value = 1, message = "Preparation time must be at least 1 minute")
    private int preparationTimeMinutes;

    private Boolean isAvailable;
    private Boolean isVeg;
    private List<String> tags;
    private Boolean isSpecialToday;

    public FoodRequest() {}

    public FoodRequest(String name, String description, double price, String category, String image, int stock, int preparationTimeMinutes, Boolean isAvailable, Boolean isVeg, List<String> tags, Boolean isSpecialToday) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.image = image;
        this.stock = stock;
        this.preparationTimeMinutes = preparationTimeMinutes;
        this.isAvailable = isAvailable;
        this.isVeg = isVeg;
        this.tags = tags;
        this.isSpecialToday = isSpecialToday;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name;
        private String description;
        private double price;
        private String category;
        private String image;
        private int stock;
        private int preparationTimeMinutes;
        private Boolean isAvailable;
        private Boolean isVeg;
        private List<String> tags;
        private Boolean isSpecialToday;

        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder price(double price) { this.price = price; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder image(String image) { this.image = image; return this; }
        public Builder stock(int stock) { this.stock = stock; return this; }
        public Builder preparationTimeMinutes(int preparationTimeMinutes) { this.preparationTimeMinutes = preparationTimeMinutes; return this; }
        public Builder isAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public Builder isVeg(Boolean isVeg) { this.isVeg = isVeg; return this; }
        public Builder tags(List<String> tags) { this.tags = tags; return this; }
        public Builder isSpecialToday(Boolean isSpecialToday) { this.isSpecialToday = isSpecialToday; return this; }

        public FoodRequest build() {
            return new FoodRequest(name, description, price, category, image, stock, preparationTimeMinutes, isAvailable, isVeg, tags, isSpecialToday);
        }
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public int getPreparationTimeMinutes() { return preparationTimeMinutes; }
    public void setPreparationTimeMinutes(int preparationTimeMinutes) { this.preparationTimeMinutes = preparationTimeMinutes; }
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean isVeg) { this.isVeg = isVeg; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public Boolean getIsSpecialToday() { return isSpecialToday; }
    public void setIsSpecialToday(Boolean isSpecialToday) { this.isSpecialToday = isSpecialToday; }
}
