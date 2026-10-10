package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.dto.DashboardStatsResponse;
import com.smartcanteen.model.CanteenSettings;
import com.smartcanteen.model.Order;
import com.smartcanteen.model.User;
import com.smartcanteen.repository.CanteenSettingsRepository;
import com.smartcanteen.repository.UserRepository;
import com.smartcanteen.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
@Tag(name = "Admin Management", description = "Analytics, user management, canteen settings, and demo simulation")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final CanteenSettingsRepository settingsRepository;

    public AdminController(AdminService adminService,
                           UserRepository userRepository,
                           CanteenSettingsRepository settingsRepository) {
        this.adminService = adminService;
        this.userRepository = userRepository;
        this.settingsRepository = settingsRepository;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get full dashboard analytics with charts data and key KPIs")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Dashboard statistics retrieved"));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get canteen analytics and metrics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getAnalytics() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Analytics retrieved"));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users (Students, Faculty, Staff, Admins)")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userRepository.findAll(), "Users list retrieved"));
    }

    @GetMapping("/settings")
    @Operation(summary = "Get canteen operational settings")
    public ResponseEntity<ApiResponse<CanteenSettings>> getSettings() {
        CanteenSettings settings = settingsRepository.findById("GLOBAL_SETTINGS")
                .orElseGet(() -> settingsRepository.save(CanteenSettings.builder()
                        .id("GLOBAL_SETTINGS")
                        .canteenName("College Central Canteen")
                        .open(true)
                        .openingTime("08:30")
                        .closingTime("18:00")
                        .maxOrdersPerSlot(25)
                        .avgPrepTimeMinutes(8)
                        .leaveNowAlertMinutes(5)
                        .updatedAt(Instant.now())
                        .build()));
        return ResponseEntity.ok(ApiResponse.success(settings, "Canteen settings retrieved"));
    }

    @PutMapping("/settings")
    @Operation(summary = "Update canteen operational settings")
    public ResponseEntity<ApiResponse<CanteenSettings>> updateSettings(@RequestBody CanteenSettings settings) {
        settings.setId("GLOBAL_SETTINGS");
        settings.setUpdatedAt(Instant.now());
        CanteenSettings saved = settingsRepository.save(settings);
        return ResponseEntity.ok(ApiResponse.success(saved, "Canteen settings updated"));
    }

    @PostMapping("/demo/advance/{orderId}")
    @Operation(summary = "Advance order status by one step for presentation/demo simulation")
    public ResponseEntity<ApiResponse<Order>> advanceDemoOrderStatus(@PathVariable String orderId) {
        Order order = adminService.advanceDemoOrderStatus(orderId);
        return ResponseEntity.ok(ApiResponse.success(order, "Demo order status advanced to " + order.getStatus()));
    }

    @PostMapping("/demo/simulate-order")
    @Operation(summary = "Trigger a simulated new order for testing or live hackathon demo")
    public ResponseEntity<ApiResponse<Order>> simulateNewOrder(@RequestParam(defaultValue = "STUDENT") String role) {
        Order order = adminService.simulateNewOrder(role);
        return ResponseEntity.ok(ApiResponse.success(order, "Simulated new order generated with Token: " + order.getTokenNumber()));
    }
}
