package com.smartcanteen.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long totalOrders;
    private long todayOrders;
    private double todayRevenue;
    private double totalRevenue;
    private long pendingOrders;
    private long preparingOrders;
    private long readyOrders;
    private long completedOrders;
    private long cancelledOrders;
    private double avgWaitMinutes;
    private double avgPrepMinutes;
    private long studentOrdersCount;
    private long facultyOrdersCount;
    private double cancellationRate;

    private List<HourlyOrderStat> ordersByHour = new ArrayList<>();
    private List<DailyRevenueStat> revenueByDay = new ArrayList<>();
    private List<PopularFoodStat> popularFoods = new ArrayList<>();
    private List<QueueTrendStat> queueTrend = new ArrayList<>();
    private Map<String, Long> categoryDistribution = new HashMap<>();

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(long totalOrders, long todayOrders, double todayRevenue, double totalRevenue, long pendingOrders, long preparingOrders, long readyOrders, long completedOrders, long cancelledOrders, double avgWaitMinutes, double avgPrepMinutes, long studentOrdersCount, long facultyOrdersCount, double cancellationRate, List<HourlyOrderStat> ordersByHour, List<DailyRevenueStat> revenueByDay, List<PopularFoodStat> popularFoods, List<QueueTrendStat> queueTrend, Map<String, Long> categoryDistribution) {
        this.totalOrders = totalOrders;
        this.todayOrders = todayOrders;
        this.todayRevenue = todayRevenue;
        this.totalRevenue = totalRevenue;
        this.pendingOrders = pendingOrders;
        this.preparingOrders = preparingOrders;
        this.readyOrders = readyOrders;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
        this.avgWaitMinutes = avgWaitMinutes;
        this.avgPrepMinutes = avgPrepMinutes;
        this.studentOrdersCount = studentOrdersCount;
        this.facultyOrdersCount = facultyOrdersCount;
        this.cancellationRate = cancellationRate;
        this.ordersByHour = ordersByHour != null ? ordersByHour : new ArrayList<>();
        this.revenueByDay = revenueByDay != null ? revenueByDay : new ArrayList<>();
        this.popularFoods = popularFoods != null ? popularFoods : new ArrayList<>();
        this.queueTrend = queueTrend != null ? queueTrend : new ArrayList<>();
        this.categoryDistribution = categoryDistribution != null ? categoryDistribution : new HashMap<>();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalOrders;
        private long todayOrders;
        private double todayRevenue;
        private double totalRevenue;
        private long pendingOrders;
        private long preparingOrders;
        private long readyOrders;
        private long completedOrders;
        private long cancelledOrders;
        private double avgWaitMinutes;
        private double avgPrepMinutes;
        private long studentOrdersCount;
        private long facultyOrdersCount;
        private double cancellationRate;
        private List<HourlyOrderStat> ordersByHour = new ArrayList<>();
        private List<DailyRevenueStat> revenueByDay = new ArrayList<>();
        private List<PopularFoodStat> popularFoods = new ArrayList<>();
        private List<QueueTrendStat> queueTrend = new ArrayList<>();
        private Map<String, Long> categoryDistribution = new HashMap<>();

        public Builder totalOrders(long totalOrders) { this.totalOrders = totalOrders; return this; }
        public Builder todayOrders(long todayOrders) { this.todayOrders = todayOrders; return this; }
        public Builder todayRevenue(double todayRevenue) { this.todayRevenue = todayRevenue; return this; }
        public Builder totalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public Builder pendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; return this; }
        public Builder preparingOrders(long preparingOrders) { this.preparingOrders = preparingOrders; return this; }
        public Builder readyOrders(long readyOrders) { this.readyOrders = readyOrders; return this; }
        public Builder completedOrders(long completedOrders) { this.completedOrders = completedOrders; return this; }
        public Builder cancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; return this; }
        public Builder avgWaitMinutes(double avgWaitMinutes) { this.avgWaitMinutes = avgWaitMinutes; return this; }
        public Builder avgPrepMinutes(double avgPrepMinutes) { this.avgPrepMinutes = avgPrepMinutes; return this; }
        public Builder studentOrdersCount(long studentOrdersCount) { this.studentOrdersCount = studentOrdersCount; return this; }
        public Builder facultyOrdersCount(long facultyOrdersCount) { this.facultyOrdersCount = facultyOrdersCount; return this; }
        public Builder cancellationRate(double cancellationRate) { this.cancellationRate = cancellationRate; return this; }
        public Builder ordersByHour(List<HourlyOrderStat> ordersByHour) { this.ordersByHour = ordersByHour; return this; }
        public Builder revenueByDay(List<DailyRevenueStat> revenueByDay) { this.revenueByDay = revenueByDay; return this; }
        public Builder popularFoods(List<PopularFoodStat> popularFoods) { this.popularFoods = popularFoods; return this; }
        public Builder queueTrend(List<QueueTrendStat> queueTrend) { this.queueTrend = queueTrend; return this; }
        public Builder categoryDistribution(Map<String, Long> categoryDistribution) { this.categoryDistribution = categoryDistribution; return this; }

        public DashboardStatsResponse build() {
            return new DashboardStatsResponse(totalOrders, todayOrders, todayRevenue, totalRevenue, pendingOrders, preparingOrders, readyOrders, completedOrders, cancelledOrders, avgWaitMinutes, avgPrepMinutes, studentOrdersCount, facultyOrdersCount, cancellationRate, ordersByHour, revenueByDay, popularFoods, queueTrend, categoryDistribution);
        }
    }

    public static class HourlyOrderStat {
        private String hour;
        private long orders;
        private double revenue;

        public HourlyOrderStat() {}

        public HourlyOrderStat(String hour, long orders, double revenue) {
            this.hour = hour;
            this.orders = orders;
            this.revenue = revenue;
        }

        public String getHour() { return hour; }
        public void setHour(String hour) { this.hour = hour; }
        public long getOrders() { return orders; }
        public void setOrders(long orders) { this.orders = orders; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double revenue) { this.revenue = revenue; }
    }

    public static class DailyRevenueStat {
        private String date;
        private double revenue;
        private long orders;

        public DailyRevenueStat() {}

        public DailyRevenueStat(String date, double revenue, long orders) {
            this.date = date;
            this.revenue = revenue;
            this.orders = orders;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double revenue) { this.revenue = revenue; }
        public long getOrders() { return orders; }
        public void setOrders(long orders) { this.orders = orders; }
    }

    public static class PopularFoodStat {
        private String name;
        private int sold;
        private double revenue;
        private String category;

        public PopularFoodStat() {}

        public PopularFoodStat(String name, int sold, double revenue, String category) {
            this.name = name;
            this.sold = sold;
            this.revenue = revenue;
            this.category = category;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String name;
            private int sold;
            private double revenue;
            private String category;

            public Builder name(String name) { this.name = name; return this; }
            public Builder sold(int sold) { this.sold = sold; return this; }
            public Builder revenue(double revenue) { this.revenue = revenue; return this; }
            public Builder category(String category) { this.category = category; return this; }

            public PopularFoodStat build() {
                return new PopularFoodStat(name, sold, revenue, category);
            }
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public int getSold() { return sold; }
        public void setSold(int sold) { this.sold = sold; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double revenue) { this.revenue = revenue; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }

    public static class QueueTrendStat {
        private String time;
        private int queueLength;

        public QueueTrendStat() {}

        public QueueTrendStat(String time, int queueLength) {
            this.time = time;
            this.queueLength = queueLength;
        }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        public int getQueueLength() { return queueLength; }
        public void setQueueLength(int queueLength) { this.queueLength = queueLength; }
    }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public long getTodayOrders() { return todayOrders; }
    public void setTodayOrders(long todayOrders) { this.todayOrders = todayOrders; }
    public double getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(double todayRevenue) { this.todayRevenue = todayRevenue; }
    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }
    public long getPreparingOrders() { return preparingOrders; }
    public void setPreparingOrders(long preparingOrders) { this.preparingOrders = preparingOrders; }
    public long getReadyOrders() { return readyOrders; }
    public void setReadyOrders(long readyOrders) { this.readyOrders = readyOrders; }
    public long getCompletedOrders() { return completedOrders; }
    public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }
    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }
    public double getAvgWaitMinutes() { return avgWaitMinutes; }
    public void setAvgWaitMinutes(double avgWaitMinutes) { this.avgWaitMinutes = avgWaitMinutes; }
    public double getAvgPrepMinutes() { return avgPrepMinutes; }
    public void setAvgPrepMinutes(double avgPrepMinutes) { this.avgPrepMinutes = avgPrepMinutes; }
    public long getStudentOrdersCount() { return studentOrdersCount; }
    public void setStudentOrdersCount(long studentOrdersCount) { this.studentOrdersCount = studentOrdersCount; }
    public long getFacultyOrdersCount() { return facultyOrdersCount; }
    public void setFacultyOrdersCount(long facultyOrdersCount) { this.facultyOrdersCount = facultyOrdersCount; }
    public double getCancellationRate() { return cancellationRate; }
    public void setCancellationRate(double cancellationRate) { this.cancellationRate = cancellationRate; }
    public List<HourlyOrderStat> getOrdersByHour() { return ordersByHour; }
    public void setOrdersByHour(List<HourlyOrderStat> ordersByHour) { this.ordersByHour = ordersByHour; }
    public List<DailyRevenueStat> getRevenueByDay() { return revenueByDay; }
    public void setRevenueByDay(List<DailyRevenueStat> revenueByDay) { this.revenueByDay = revenueByDay; }
    public List<PopularFoodStat> getPopularFoods() { return popularFoods; }
    public void setPopularFoods(List<PopularFoodStat> popularFoods) { this.popularFoods = popularFoods; }
    public List<QueueTrendStat> getQueueTrend() { return queueTrend; }
    public void setQueueTrend(List<QueueTrendStat> queueTrend) { this.queueTrend = queueTrend; }
    public Map<String, Long> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(Map<String, Long> categoryDistribution) { this.categoryDistribution = categoryDistribution; }
}
