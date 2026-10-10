package com.smartcanteen.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "canteen_settings")
public class CanteenSettings {

    @Id
    private String id = "GLOBAL_SETTINGS";

    private String canteenName = "Apex University Central Canteen";
    private boolean open = true;
    private String openingTime = "08:00";
    private String closingTime = "20:00";
    private int maxOrdersPerSlot = 25;
    private int slotDurationMinutes = 10;
    private int avgPrepTimeMinutes = 8;
    private int leaveNowAlertMinutes = 5;
    private int crowdThresholdMedium = 15;
    private int crowdThresholdHigh = 30;
    private boolean allowPreorders = true;
    private boolean aiRecommendationsEnabled = true;
    private String announcementBanner = "🔥 Lunch rush hours expected between 12:45 PM and 01:15 PM. Pre-order now to skip the queue!";
    private Instant updatedAt = Instant.now();

    public CanteenSettings() {}

    public CanteenSettings(String id, String canteenName, boolean open, String openingTime, String closingTime, int maxOrdersPerSlot, int slotDurationMinutes, int avgPrepTimeMinutes, int leaveNowAlertMinutes, int crowdThresholdMedium, int crowdThresholdHigh, boolean allowPreorders, boolean aiRecommendationsEnabled, String announcementBanner, Instant updatedAt) {
        this.id = id != null ? id : "GLOBAL_SETTINGS";
        this.canteenName = canteenName;
        this.open = open;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.maxOrdersPerSlot = maxOrdersPerSlot;
        this.slotDurationMinutes = slotDurationMinutes;
        this.avgPrepTimeMinutes = avgPrepTimeMinutes;
        this.leaveNowAlertMinutes = leaveNowAlertMinutes;
        this.crowdThresholdMedium = crowdThresholdMedium;
        this.crowdThresholdHigh = crowdThresholdHigh;
        this.allowPreorders = allowPreorders;
        this.aiRecommendationsEnabled = aiRecommendationsEnabled;
        this.announcementBanner = announcementBanner;
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id = "GLOBAL_SETTINGS";
        private String canteenName = "Apex University Central Canteen";
        private boolean open = true;
        private String openingTime = "08:00";
        private String closingTime = "20:00";
        private int maxOrdersPerSlot = 25;
        private int slotDurationMinutes = 10;
        private int avgPrepTimeMinutes = 8;
        private int leaveNowAlertMinutes = 5;
        private int crowdThresholdMedium = 15;
        private int crowdThresholdHigh = 30;
        private boolean allowPreorders = true;
        private boolean aiRecommendationsEnabled = true;
        private String announcementBanner = "🔥 Lunch rush hours expected between 12:45 PM and 01:15 PM. Pre-order now to skip the queue!";
        private Instant updatedAt = Instant.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder canteenName(String canteenName) { this.canteenName = canteenName; return this; }
        public Builder open(boolean open) { this.open = open; return this; }
        public Builder openingTime(String openingTime) { this.openingTime = openingTime; return this; }
        public Builder closingTime(String closingTime) { this.closingTime = closingTime; return this; }
        public Builder maxOrdersPerSlot(int maxOrdersPerSlot) { this.maxOrdersPerSlot = maxOrdersPerSlot; return this; }
        public Builder slotDurationMinutes(int slotDurationMinutes) { this.slotDurationMinutes = slotDurationMinutes; return this; }
        public Builder avgPrepTimeMinutes(int avgPrepTimeMinutes) { this.avgPrepTimeMinutes = avgPrepTimeMinutes; return this; }
        public Builder leaveNowAlertMinutes(int leaveNowAlertMinutes) { this.leaveNowAlertMinutes = leaveNowAlertMinutes; return this; }
        public Builder crowdThresholdMedium(int crowdThresholdMedium) { this.crowdThresholdMedium = crowdThresholdMedium; return this; }
        public Builder crowdThresholdHigh(int crowdThresholdHigh) { this.crowdThresholdHigh = crowdThresholdHigh; return this; }
        public Builder allowPreorders(boolean allowPreorders) { this.allowPreorders = allowPreorders; return this; }
        public Builder aiRecommendationsEnabled(boolean aiRecommendationsEnabled) { this.aiRecommendationsEnabled = aiRecommendationsEnabled; return this; }
        public Builder announcementBanner(String announcementBanner) { this.announcementBanner = announcementBanner; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public CanteenSettings build() {
            return new CanteenSettings(id, canteenName, open, openingTime, closingTime, maxOrdersPerSlot, slotDurationMinutes, avgPrepTimeMinutes, leaveNowAlertMinutes, crowdThresholdMedium, crowdThresholdHigh, allowPreorders, aiRecommendationsEnabled, announcementBanner, updatedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCanteenName() { return canteenName; }
    public void setCanteenName(String canteenName) { this.canteenName = canteenName; }
    public boolean isOpen() { return open; }
    public void setOpen(boolean open) { this.open = open; }
    public String getOpeningTime() { return openingTime; }
    public void setOpeningTime(String openingTime) { this.openingTime = openingTime; }
    public String getClosingTime() { return closingTime; }
    public void setClosingTime(String closingTime) { this.closingTime = closingTime; }
    public int getMaxOrdersPerSlot() { return maxOrdersPerSlot; }
    public void setMaxOrdersPerSlot(int maxOrdersPerSlot) { this.maxOrdersPerSlot = maxOrdersPerSlot; }
    public int getSlotDurationMinutes() { return slotDurationMinutes; }
    public void setSlotDurationMinutes(int slotDurationMinutes) { this.slotDurationMinutes = slotDurationMinutes; }
    public int getAvgPrepTimeMinutes() { return avgPrepTimeMinutes; }
    public void setAvgPrepTimeMinutes(int avgPrepTimeMinutes) { this.avgPrepTimeMinutes = avgPrepTimeMinutes; }
    public int getLeaveNowAlertMinutes() { return leaveNowAlertMinutes; }
    public void setLeaveNowAlertMinutes(int leaveNowAlertMinutes) { this.leaveNowAlertMinutes = leaveNowAlertMinutes; }
    public int getCrowdThresholdMedium() { return crowdThresholdMedium; }
    public void setCrowdThresholdMedium(int crowdThresholdMedium) { this.crowdThresholdMedium = crowdThresholdMedium; }
    public int getCrowdThresholdHigh() { return crowdThresholdHigh; }
    public void setCrowdThresholdHigh(int crowdThresholdHigh) { this.crowdThresholdHigh = crowdThresholdHigh; }
    public boolean isAllowPreorders() { return allowPreorders; }
    public void setAllowPreorders(boolean allowPreorders) { this.allowPreorders = allowPreorders; }
    public boolean isAiRecommendationsEnabled() { return aiRecommendationsEnabled; }
    public void setAiRecommendationsEnabled(boolean aiRecommendationsEnabled) { this.aiRecommendationsEnabled = aiRecommendationsEnabled; }
    public String getAnnouncementBanner() { return announcementBanner; }
    public void setAnnouncementBanner(String announcementBanner) { this.announcementBanner = announcementBanner; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @com.fasterxml.jackson.annotation.JsonProperty("isOpen")
    public boolean getIsOpen() { return open; }
    public void setIsOpen(boolean isOpen) { this.open = isOpen; }

    @com.fasterxml.jackson.annotation.JsonProperty("maxSlotCapacity")
    public int getMaxSlotCapacity() { return maxOrdersPerSlot; }
    public void setMaxSlotCapacity(int cap) { this.maxOrdersPerSlot = cap; }

    @com.fasterxml.jackson.annotation.JsonProperty("averagePrepTimeMinutes")
    public int getAveragePrepTimeMinutes() { return avgPrepTimeMinutes; }
    public void setAveragePrepTimeMinutes(int avg) { this.avgPrepTimeMinutes = avg; }

    @com.fasterxml.jackson.annotation.JsonProperty("leaveNowMinutesThreshold")
    public int getLeaveNowMinutesThreshold() { return leaveNowAlertMinutes; }
    public void setLeaveNowMinutesThreshold(int threshold) { this.leaveNowAlertMinutes = threshold; }
}
