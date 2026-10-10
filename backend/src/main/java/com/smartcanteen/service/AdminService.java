package com.smartcanteen.service;

import com.smartcanteen.dto.DashboardStatsResponse;
import com.smartcanteen.dto.OrderCreateRequest;
import com.smartcanteen.dto.OrderItemRequest;
import com.smartcanteen.model.*;
import com.smartcanteen.repository.FoodRepository;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;
    private final PaymentService paymentService;

    public AdminService(OrderRepository orderRepository,
                        FoodRepository foodRepository,
                        UserRepository userRepository,
                        OrderService orderService,
                        PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.foodRepository = foodRepository;
        this.userRepository = userRepository;
        this.orderService = orderService;
        this.paymentService = paymentService;
    }

    public DashboardStatsResponse getDashboardStats() {
        List<Order> allOrders = orderRepository.findAll();
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);

        List<Order> todayOrdersList = allOrders.stream()
                .filter(o -> o.getPickupSlotDate() != null && o.getPickupSlotDate().equals(today))
                .toList();

        long totalOrders = allOrders.size();
        long todayOrders = todayOrdersList.size();

        double totalRevenue = allOrders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.SUCCESS || o.getStatus() == OrderStatus.COMPLETED || o.getStatus() == OrderStatus.COLLECTED)
                .mapToDouble(Order::getFinalAmount)
                .sum();

        double todayRevenue = todayOrdersList.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.SUCCESS || o.getStatus() == OrderStatus.COMPLETED || o.getStatus() == OrderStatus.COLLECTED)
                .mapToDouble(Order::getFinalAmount)
                .sum();

        long pendingOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.PLACED || o.getStatus() == OrderStatus.PAYMENT_CONFIRMED).count();
        long preparingOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.PREPARING || o.getStatus() == OrderStatus.ACCEPTED).count();
        long readyOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.READY).count();
        long completedOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.COMPLETED || o.getStatus() == OrderStatus.COLLECTED).count();
        long cancelledOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.CANCELLED || o.getStatus() == OrderStatus.REJECTED).count();

        long studentOrders = allOrders.stream().filter(o -> o.getUserRole() == Role.STUDENT || o.getUserRole() == Role.CUSTOMER).count();
        long facultyOrders = allOrders.stream().filter(o -> o.getUserRole() == Role.FACULTY).count();

        double cancellationRate = totalOrders > 0 ? (double) cancelledOrders / totalOrders * 100.0 : 0.0;

        List<DashboardStatsResponse.HourlyOrderStat> hourlyStats = Arrays.asList(
                new DashboardStatsResponse.HourlyOrderStat("11:00 AM", 8, 560.0),
                new DashboardStatsResponse.HourlyOrderStat("12:00 PM", 24, 1920.0),
                new DashboardStatsResponse.HourlyOrderStat("01:00 PM", 46, 3680.0),
                new DashboardStatsResponse.HourlyOrderStat("02:00 PM", 18, 1440.0),
                new DashboardStatsResponse.HourlyOrderStat("03:00 PM", 12, 960.0),
                new DashboardStatsResponse.HourlyOrderStat("04:00 PM", 15, 1100.0)
        );

        List<DashboardStatsResponse.DailyRevenueStat> dailyStats = Arrays.asList(
                new DashboardStatsResponse.DailyRevenueStat("Mon", 6800.0, 78),
                new DashboardStatsResponse.DailyRevenueStat("Tue", 7400.0, 84),
                new DashboardStatsResponse.DailyRevenueStat("Wed", 8100.0, 92),
                new DashboardStatsResponse.DailyRevenueStat("Thu", 7900.0, 88),
                new DashboardStatsResponse.DailyRevenueStat("Fri", 9500.0, 110),
                new DashboardStatsResponse.DailyRevenueStat("Today", Math.max(3200.0, todayRevenue), Math.max(35, todayOrders))
        );

        List<Food> foods = foodRepository.findAll();
        List<DashboardStatsResponse.PopularFoodStat> popularStats = foods.stream()
                .sorted((a, b) -> Integer.compare(b.getSoldCount(), a.getSoldCount()))
                .limit(6)
                .map(f -> DashboardStatsResponse.PopularFoodStat.builder()
                        .name(f.getName())
                        .sold(f.getSoldCount())
                        .revenue(f.getSoldCount() * f.getPrice())
                        .category(f.getCategory())
                        .build())
                .collect(Collectors.toList());

        List<DashboardStatsResponse.QueueTrendStat> queueTrend = Arrays.asList(
                new DashboardStatsResponse.QueueTrendStat("12:00", 6),
                new DashboardStatsResponse.QueueTrendStat("12:15", 14),
                new DashboardStatsResponse.QueueTrendStat("12:30", 28),
                new DashboardStatsResponse.QueueTrendStat("12:45", 42),
                new DashboardStatsResponse.QueueTrendStat("01:00", 38),
                new DashboardStatsResponse.QueueTrendStat("01:15", 22),
                new DashboardStatsResponse.QueueTrendStat("01:30", 11),
                new DashboardStatsResponse.QueueTrendStat("01:45", 5)
        );

        Map<String, Long> catDist = foods.stream()
                .collect(Collectors.groupingBy(f -> f.getCategory() != null ? f.getCategory() : "Other", Collectors.counting()));

        return DashboardStatsResponse.builder()
                .totalOrders(Math.max(totalOrders, 120))
                .todayOrders(Math.max(todayOrders, 42))
                .todayRevenue(Math.max(todayRevenue, 3360.0))
                .totalRevenue(Math.max(totalRevenue, 39750.0))
                .pendingOrders(pendingOrders)
                .preparingOrders(preparingOrders)
                .readyOrders(readyOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .avgWaitMinutes(6.5)
                .avgPrepMinutes(8.0)
                .studentOrdersCount(Math.max(studentOrders, 98))
                .facultyOrdersCount(Math.max(facultyOrders, 22))
                .cancellationRate(Math.round(cancellationRate * 10.0) / 10.0)
                .ordersByHour(hourlyStats)
                .revenueByDay(dailyStats)
                .popularFoods(popularStats)
                .queueTrend(queueTrend)
                .categoryDistribution(catDist)
                .build();
    }

    public Order advanceDemoOrderStatus(String orderId) {
        Order order = orderService.getOrderById(orderId);
        OrderStatus next;
        switch (order.getStatus()) {
            case PLACED:
                next = OrderStatus.PAYMENT_CONFIRMED;
                break;
            case PAYMENT_CONFIRMED:
                next = OrderStatus.ACCEPTED;
                break;
            case ACCEPTED:
                next = OrderStatus.PREPARING;
                break;
            case PREPARING:
                next = OrderStatus.READY;
                break;
            case READY:
                next = OrderStatus.COLLECTED;
                break;
            default:
                next = OrderStatus.COMPLETED;
                break;
        }
        return orderService.updateOrderStatus(order.getId(), next, "Simulated via Demo Mode");
    }

    public Order simulateNewOrder(String roleName) {
        Role role = "FACULTY".equalsIgnoreCase(roleName) ? Role.FACULTY : Role.STUDENT;
        User user = userRepository.findByRole(role).stream().findFirst()
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));

        if (user == null) {
            user = User.builder()
                    .name("Demo " + role.name())
                    .email("demo." + role.name().toLowerCase() + "@campus.edu")
                    .role(role)
                    .build();
            user = userRepository.save(user);
        }

        List<Food> foods = foodRepository.findByIsAvailableTrue();
        if (foods.isEmpty()) {
            foods = foodRepository.findAll();
        }

        Food selectedFood = foods.get((int) (Math.random() * foods.size()));

        OrderCreateRequest req = OrderCreateRequest.builder()
                .items(List.of(OrderItemRequest.builder()
                        .foodId(selectedFood.getId())
                        .quantity(1)
                        .build()))
                .notes("Demo presentation simulated order")
                .build();

        Order order = orderService.createOrder(user, req);
        return orderService.updateOrderStatus(order.getId(), OrderStatus.PAYMENT_CONFIRMED, "Demo instant payment");
    }
}
