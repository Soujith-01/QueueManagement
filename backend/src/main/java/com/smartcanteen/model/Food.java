package com.smartcanteen.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "foods")
public class Food {

    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String category;
    private String image;
    private int stock = 0;
    private int initialStock = 100;
    private int soldCount = 0;
    private int preparationTimeMinutes = 8;
    private boolean isAvailable = true;
    private boolean isVeg = true;
    private double rating = 4.5;
    private int ratingCount = 0;
    private List<String> tags = new ArrayList<>();
    private boolean isSpecialToday = false;

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public Food() {}

    public Food(String id, String name, String description, double price, String category, String image, int stock, int initialStock, int soldCount, int preparationTimeMinutes, boolean isAvailable, boolean isVeg, double rating, int ratingCount, List<String> tags, boolean isSpecialToday, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.image = image;
        this.stock = stock;
        this.initialStock = initialStock;
        this.soldCount = soldCount;
        this.preparationTimeMinutes = preparationTimeMinutes;
        this.isAvailable = isAvailable;
        this.isVeg = isVeg;
        this.rating = rating;
        this.ratingCount = ratingCount;
        this.tags = tags != null ? tags : new ArrayList<>();
        this.isSpecialToday = isSpecialToday;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String name;
        private String description;
        private double price;
        private String category;
        private String image;
        private int stock = 0;
        private int initialStock = 100;
        private int soldCount = 0;
        private int preparationTimeMinutes = 8;
        private boolean isAvailable = true;
        private boolean isVeg = true;
        private double rating = 4.5;
        private int ratingCount = 0;
        private List<String> tags = new ArrayList<>();
        private boolean isSpecialToday = false;
        private Instant createdAt = Instant.now();
        private Instant updatedAt = Instant.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder price(double price) { this.price = price; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder image(String image) { this.image = image; return this; }
        public Builder stock(int stock) { this.stock = stock; return this; }
        public Builder initialStock(int initialStock) { this.initialStock = initialStock; return this; }
        public Builder soldCount(int soldCount) { this.soldCount = soldCount; return this; }
        public Builder preparationTimeMinutes(int preparationTimeMinutes) { this.preparationTimeMinutes = preparationTimeMinutes; return this; }
        public Builder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public Builder isVeg(boolean isVeg) { this.isVeg = isVeg; return this; }
        public Builder rating(double rating) { this.rating = rating; return this; }
        public Builder ratingCount(int ratingCount) { this.ratingCount = ratingCount; return this; }
        public Builder tags(List<String> tags) { this.tags = tags; return this; }
        public Builder isSpecialToday(boolean isSpecialToday) { this.isSpecialToday = isSpecialToday; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Food build() {
            return new Food(id, name, description, price, category, image, stock, initialStock, soldCount, preparationTimeMinutes, isAvailable, isVeg, rating, ratingCount, tags, isSpecialToday, createdAt, updatedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public int getInitialStock() { return initialStock; }
    public void setInitialStock(int initialStock) { this.initialStock = initialStock; }
    public int getSoldCount() { return soldCount; }
    public void setSoldCount(int soldCount) { this.soldCount = soldCount; }
    public int getPreparationTimeMinutes() { return preparationTimeMinutes; }
    public void setPreparationTimeMinutes(int preparationTimeMinutes) { this.preparationTimeMinutes = preparationTimeMinutes; }
    @com.fasterxml.jackson.annotation.JsonProperty("isAvailable")
    public boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(boolean available) { this.isAvailable = available; }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { this.isAvailable = available; }

    @com.fasterxml.jackson.annotation.JsonProperty("isVeg")
    public boolean getIsVeg() { return isVeg; }
    public void setIsVeg(boolean veg) { this.isVeg = veg; }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean veg) { this.isVeg = veg; }

    @com.fasterxml.jackson.annotation.JsonProperty("imageUrl")
    public String getImageUrl() { return image; }

    @com.fasterxml.jackson.annotation.JsonProperty("preparationTime")
    public int getPreparationTime() { return preparationTimeMinutes; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getRatingCount() { return ratingCount; }
    public void setRatingCount(int ratingCount) { this.ratingCount = ratingCount; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public boolean isSpecialToday() { return isSpecialToday; }
    public void setSpecialToday(boolean specialToday) { isSpecialToday = specialToday; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
