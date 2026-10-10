package com.smartcanteen.dto;

import com.smartcanteen.model.Food;

import java.util.ArrayList;
import java.util.List;

public class AiMealRecommendationResponse {
    private String greeting;
    private String userHabitSummary;
    private List<Food> recommendedItems = new ArrayList<>();
    private List<ComboRecommendation> suggestedCombos = new ArrayList<>();

    public AiMealRecommendationResponse() {}

    public AiMealRecommendationResponse(String greeting, String userHabitSummary, List<Food> recommendedItems, List<ComboRecommendation> suggestedCombos) {
        this.greeting = greeting;
        this.userHabitSummary = userHabitSummary;
        this.recommendedItems = recommendedItems != null ? recommendedItems : new ArrayList<>();
        this.suggestedCombos = suggestedCombos != null ? suggestedCombos : new ArrayList<>();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String greeting;
        private String userHabitSummary;
        private List<Food> recommendedItems = new ArrayList<>();
        private List<ComboRecommendation> suggestedCombos = new ArrayList<>();

        public Builder greeting(String greeting) { this.greeting = greeting; return this; }
        public Builder userHabitSummary(String userHabitSummary) { this.userHabitSummary = userHabitSummary; return this; }
        public Builder recommendedItems(List<Food> recommendedItems) { this.recommendedItems = recommendedItems; return this; }
        public Builder suggestedCombos(List<ComboRecommendation> suggestedCombos) { this.suggestedCombos = suggestedCombos; return this; }

        public AiMealRecommendationResponse build() {
            return new AiMealRecommendationResponse(greeting, userHabitSummary, recommendedItems, suggestedCombos);
        }
    }

    public static class ComboRecommendation {
        private String title;
        private String description;
        private List<String> itemNames = new ArrayList<>();
        private double comboPrice;
        private double savings;

        public ComboRecommendation() {}

        public ComboRecommendation(String title, String description, List<String> itemNames, double comboPrice, double savings) {
            this.title = title;
            this.description = description;
            this.itemNames = itemNames != null ? itemNames : new ArrayList<>();
            this.comboPrice = comboPrice;
            this.savings = savings;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String title;
            private String description;
            private List<String> itemNames = new ArrayList<>();
            private double comboPrice;
            private double savings;

            public Builder title(String title) { this.title = title; return this; }
            public Builder description(String description) { this.description = description; return this; }
            public Builder itemNames(List<String> itemNames) { this.itemNames = itemNames; return this; }
            public Builder comboPrice(double comboPrice) { this.comboPrice = comboPrice; return this; }
            public Builder savings(double savings) { this.savings = savings; return this; }

            public ComboRecommendation build() {
                return new ComboRecommendation(title, description, itemNames, comboPrice, savings);
            }
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<String> getItemNames() { return itemNames; }
        public void setItemNames(List<String> itemNames) { this.itemNames = itemNames; }
        public double getComboPrice() { return comboPrice; }
        public void setComboPrice(double comboPrice) { this.comboPrice = comboPrice; }
        public double getSavings() { return savings; }
        public void setSavings(double savings) { this.savings = savings; }
    }

    public String getGreeting() { return greeting; }
    public void setGreeting(String greeting) { this.greeting = greeting; }
    public String getUserHabitSummary() { return userHabitSummary; }
    public void setUserHabitSummary(String userHabitSummary) { this.userHabitSummary = userHabitSummary; }
    public List<Food> getRecommendedItems() { return recommendedItems; }
    public void setRecommendedItems(List<Food> recommendedItems) { this.recommendedItems = recommendedItems; }
    public List<ComboRecommendation> getSuggestedCombos() { return suggestedCombos; }
    public void setSuggestedCombos(List<ComboRecommendation> suggestedCombos) { this.suggestedCombos = suggestedCombos; }
}
