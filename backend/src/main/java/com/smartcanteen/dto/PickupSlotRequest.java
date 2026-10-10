package com.smartcanteen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class PickupSlotRequest {
    @NotBlank(message = "Date is required (YYYY-MM-DD)")
    private String date;

    @NotBlank(message = "Start time is required (e.g. 12:30)")
    private String startTime;

    @NotBlank(message = "End time is required (e.g. 12:40)")
    private String endTime;

    private String label;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    private Boolean isAvailable;

    public PickupSlotRequest() {}

    public PickupSlotRequest(String date, String startTime, String endTime, String label, int capacity, Boolean isAvailable) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.label = label;
        this.capacity = capacity;
        this.isAvailable = isAvailable;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String date;
        private String startTime;
        private String endTime;
        private String label;
        private int capacity;
        private Boolean isAvailable;

        public Builder date(String date) { this.date = date; return this; }
        public Builder startTime(String startTime) { this.startTime = startTime; return this; }
        public Builder endTime(String endTime) { this.endTime = endTime; return this; }
        public Builder label(String label) { this.label = label; return this; }
        public Builder capacity(int capacity) { this.capacity = capacity; return this; }
        public Builder isAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; return this; }

        public PickupSlotRequest build() {
            return new PickupSlotRequest(date, startTime, endTime, label, capacity, isAvailable);
        }
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
