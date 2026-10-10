package com.smartcanteen.dto;

import java.util.ArrayList;
import java.util.List;

public class AiPredictionResponse {
    private String currentCrowdStatus;
    private String peakTimeRange;
    private String recommendedOrderTime;
    private String insightSummary;
    private List<TimeSlotCrowdForecast> hourlyForecast = new ArrayList<>();

    public AiPredictionResponse() {}

    public AiPredictionResponse(String currentCrowdStatus, String peakTimeRange, String recommendedOrderTime, String insightSummary, List<TimeSlotCrowdForecast> hourlyForecast) {
        this.currentCrowdStatus = currentCrowdStatus;
        this.peakTimeRange = peakTimeRange;
        this.recommendedOrderTime = recommendedOrderTime;
        this.insightSummary = insightSummary;
        this.hourlyForecast = hourlyForecast != null ? hourlyForecast : new ArrayList<>();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String currentCrowdStatus;
        private String peakTimeRange;
        private String recommendedOrderTime;
        private String insightSummary;
        private List<TimeSlotCrowdForecast> hourlyForecast = new ArrayList<>();

        public Builder currentCrowdStatus(String currentCrowdStatus) { this.currentCrowdStatus = currentCrowdStatus; return this; }
        public Builder peakTimeRange(String peakTimeRange) { this.peakTimeRange = peakTimeRange; return this; }
        public Builder recommendedOrderTime(String recommendedOrderTime) { this.recommendedOrderTime = recommendedOrderTime; return this; }
        public Builder insightSummary(String insightSummary) { this.insightSummary = insightSummary; return this; }
        public Builder hourlyForecast(List<TimeSlotCrowdForecast> hourlyForecast) { this.hourlyForecast = hourlyForecast; return this; }

        public AiPredictionResponse build() {
            return new AiPredictionResponse(currentCrowdStatus, peakTimeRange, recommendedOrderTime, insightSummary, hourlyForecast);
        }
    }

    public static class TimeSlotCrowdForecast {
        private String timeSlot;
        private String crowdLevel;
        private int estimatedOrders;
        private int estimatedWaitMinutes;

        public TimeSlotCrowdForecast() {}

        public TimeSlotCrowdForecast(String timeSlot, String crowdLevel, int estimatedOrders, int estimatedWaitMinutes) {
            this.timeSlot = timeSlot;
            this.crowdLevel = crowdLevel;
            this.estimatedOrders = estimatedOrders;
            this.estimatedWaitMinutes = estimatedWaitMinutes;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String timeSlot;
            private String crowdLevel;
            private int estimatedOrders;
            private int estimatedWaitMinutes;

            public Builder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
            public Builder crowdLevel(String crowdLevel) { this.crowdLevel = crowdLevel; return this; }
            public Builder estimatedOrders(int estimatedOrders) { this.estimatedOrders = estimatedOrders; return this; }
            public Builder estimatedWaitMinutes(int estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; return this; }

            public TimeSlotCrowdForecast build() {
                return new TimeSlotCrowdForecast(timeSlot, crowdLevel, estimatedOrders, estimatedWaitMinutes);
            }
        }

        public String getTimeSlot() { return timeSlot; }
        public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
        public String getCrowdLevel() { return crowdLevel; }
        public void setCrowdLevel(String crowdLevel) { this.crowdLevel = crowdLevel; }
        public int getEstimatedOrders() { return estimatedOrders; }
        public void setEstimatedOrders(int estimatedOrders) { this.estimatedOrders = estimatedOrders; }
        public int getEstimatedWaitMinutes() { return estimatedWaitMinutes; }
        public void setEstimatedWaitMinutes(int estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; }
    }

    public String getCurrentCrowdStatus() { return currentCrowdStatus; }
    public void setCurrentCrowdStatus(String currentCrowdStatus) { this.currentCrowdStatus = currentCrowdStatus; }
    public String getPeakTimeRange() { return peakTimeRange; }
    public void setPeakTimeRange(String peakTimeRange) { this.peakTimeRange = peakTimeRange; }
    public String getRecommendedOrderTime() { return recommendedOrderTime; }
    public void setRecommendedOrderTime(String recommendedOrderTime) { this.recommendedOrderTime = recommendedOrderTime; }
    public String getInsightSummary() { return insightSummary; }
    public void setInsightSummary(String insightSummary) { this.insightSummary = insightSummary; }
    public List<TimeSlotCrowdForecast> getHourlyForecast() { return hourlyForecast; }
    public void setHourlyForecast(List<TimeSlotCrowdForecast> hourlyForecast) { this.hourlyForecast = hourlyForecast; }
}
