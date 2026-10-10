package com.smartcanteen.dto;

import java.util.ArrayList;
import java.util.List;

public class QueueStatusResponse {
    private int totalInQueue;
    private int ordersPreparing;
    private int ordersReady;
    private int estimatedWaitMinutes;
    private String crowdLevel;
    private String recommendedPickupSlot;
    private String announcementBanner;
    private List<String> readyTokens = new ArrayList<>();
    private List<String> preparingTokens = new ArrayList<>();

    public QueueStatusResponse() {}

    public QueueStatusResponse(int totalInQueue, int ordersPreparing, int ordersReady, int estimatedWaitMinutes, String crowdLevel, String recommendedPickupSlot, String announcementBanner, List<String> readyTokens, List<String> preparingTokens) {
        this.totalInQueue = totalInQueue;
        this.ordersPreparing = ordersPreparing;
        this.ordersReady = ordersReady;
        this.estimatedWaitMinutes = estimatedWaitMinutes;
        this.crowdLevel = crowdLevel;
        this.recommendedPickupSlot = recommendedPickupSlot;
        this.announcementBanner = announcementBanner;
        this.readyTokens = readyTokens != null ? readyTokens : new ArrayList<>();
        this.preparingTokens = preparingTokens != null ? preparingTokens : new ArrayList<>();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private int totalInQueue;
        private int ordersPreparing;
        private int ordersReady;
        private int estimatedWaitMinutes;
        private String crowdLevel;
        private String recommendedPickupSlot;
        private String announcementBanner;
        private List<String> readyTokens = new ArrayList<>();
        private List<String> preparingTokens = new ArrayList<>();

        public Builder totalInQueue(int totalInQueue) { this.totalInQueue = totalInQueue; return this; }
        public Builder ordersPreparing(int ordersPreparing) { this.ordersPreparing = ordersPreparing; return this; }
        public Builder ordersReady(int ordersReady) { this.ordersReady = ordersReady; return this; }
        public Builder estimatedWaitMinutes(int estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; return this; }
        public Builder crowdLevel(String crowdLevel) { this.crowdLevel = crowdLevel; return this; }
        public Builder recommendedPickupSlot(String recommendedPickupSlot) { this.recommendedPickupSlot = recommendedPickupSlot; return this; }
        public Builder announcementBanner(String announcementBanner) { this.announcementBanner = announcementBanner; return this; }
        public Builder readyTokens(List<String> readyTokens) { this.readyTokens = readyTokens; return this; }
        public Builder preparingTokens(List<String> preparingTokens) { this.preparingTokens = preparingTokens; return this; }

        public QueueStatusResponse build() {
            return new QueueStatusResponse(totalInQueue, ordersPreparing, ordersReady, estimatedWaitMinutes, crowdLevel, recommendedPickupSlot, announcementBanner, readyTokens, preparingTokens);
        }
    }

    public int getTotalInQueue() { return totalInQueue; }
    public void setTotalInQueue(int totalInQueue) { this.totalInQueue = totalInQueue; }
    public int getOrdersPreparing() { return ordersPreparing; }
    public void setOrdersPreparing(int ordersPreparing) { this.ordersPreparing = ordersPreparing; }
    public int getOrdersReady() { return ordersReady; }
    public void setOrdersReady(int ordersReady) { this.ordersReady = ordersReady; }
    public int getEstimatedWaitMinutes() { return estimatedWaitMinutes; }
    public void setEstimatedWaitMinutes(int estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; }
    public String getCrowdLevel() { return crowdLevel; }
    public void setCrowdLevel(String crowdLevel) { this.crowdLevel = crowdLevel; }
    public String getRecommendedPickupSlot() { return recommendedPickupSlot; }
    public void setRecommendedPickupSlot(String recommendedPickupSlot) { this.recommendedPickupSlot = recommendedPickupSlot; }
    public String getAnnouncementBanner() { return announcementBanner; }
    public void setAnnouncementBanner(String announcementBanner) { this.announcementBanner = announcementBanner; }
    public List<String> getReadyTokens() { return readyTokens; }
    public void setReadyTokens(List<String> readyTokens) { this.readyTokens = readyTokens; }
    public List<String> getPreparingTokens() { return preparingTokens; }
    public void setPreparingTokens(List<String> preparingTokens) { this.preparingTokens = preparingTokens; }
}
