package com.smartcanteen.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "pickup_slots")
public class PickupSlot {

    @Id
    private String id;
    private String date;
    private String startTime;
    private String endTime;
    private String label;
    private int capacity = 25;
    private int currentOrders = 0;
    private boolean isAvailable = true;

    public PickupSlot() {}

    public PickupSlot(String id, String date, String startTime, String endTime, String label, int capacity, int currentOrders, boolean isAvailable) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.label = label;
        this.capacity = capacity;
        this.currentOrders = currentOrders;
        this.isAvailable = isAvailable;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String date;
        private String startTime;
        private String endTime;
        private String label;
        private int capacity = 25;
        private int currentOrders = 0;
        private boolean isAvailable = true;

        public Builder id(String id) { this.id = id; return this; }
        public Builder date(String date) { this.date = date; return this; }
        public Builder startTime(String startTime) { this.startTime = startTime; return this; }
        public Builder endTime(String endTime) { this.endTime = endTime; return this; }
        public Builder label(String label) { this.label = label; return this; }
        public Builder capacity(int capacity) { this.capacity = capacity; return this; }
        public Builder currentOrders(int currentOrders) { this.currentOrders = currentOrders; return this; }
        public Builder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }

        public PickupSlot build() {
            return new PickupSlot(id, date, startTime, endTime, label, capacity, currentOrders, isAvailable);
        }
    }

    public boolean isFull() {
        return currentOrders >= capacity;
    }

    public int getRemainingCapacity() {
        return Math.max(0, capacity - currentOrders);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public int getCurrentOrders() { return currentOrders; }
    public void setCurrentOrders(int currentOrders) { this.currentOrders = currentOrders; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
}
