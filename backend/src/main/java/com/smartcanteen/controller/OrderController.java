package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.dto.OrderCancelRequest;
import com.smartcanteen.dto.OrderCreateRequest;
import com.smartcanteen.dto.OrderStatusUpdateRequest;
import com.smartcanteen.model.Order;
import com.smartcanteen.model.User;
import com.smartcanteen.security.UserPrincipal;
import com.smartcanteen.service.AuthService;
import com.smartcanteen.service.OrderService;
import com.smartcanteen.service.QueueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order placement, tracking, QR verification, and KDS management")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;
    private final QueueService queueService;

    public OrderController(OrderService orderService, AuthService authService, QueueService queueService) {
        this.orderService = orderService;
        this.authService = authService;
        this.queueService = queueService;
    }

    @PostMapping
    @Operation(summary = "Place a new food pre-order")
    public ResponseEntity<ApiResponse<Order>> createOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody OrderCreateRequest request) {

        User user = authService.getCurrentUser(userPrincipal.getId());
        Order order = orderService.createOrder(user, request);
        return ResponseEntity.ok(ApiResponse.success(order, "Order placed successfully! Proceed to payment."));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single order details with real-time queue position and Leave-Now status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderById(@PathVariable String id) {
        Order order = orderService.getOrderById(id);
        int liveQueuePos = queueService.calculateQueuePosition(order.getId());
        boolean leaveNow = queueService.shouldLeaveNow(order);

        Map<String, Object> data = new HashMap<>();
        data.put("order", order);
        data.put("liveQueuePosition", liveQueuePos);
        data.put("shouldLeaveNow", leaveNow);

        return ResponseEntity.ok(ApiResponse.success(data, "Order details retrieved"));
    }

    @GetMapping("/user/me")
    @Operation(summary = "Get order history for currently logged-in user")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Order> orders = orderService.getUserOrders(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(orders, "User orders retrieved"));
    }

    @GetMapping("/user/active")
    @Operation(summary = "Get active uncollected orders for currently logged-in user")
    public ResponseEntity<ApiResponse<List<Order>>> getMyActiveOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Order> active = orderService.getUserActiveOrders(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(active, "Active orders retrieved"));
    }

    @GetMapping("/kitchen/active")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Get active kitchen orders for KDS display screen (Staff/Admin)")
    public ResponseEntity<ApiResponse<List<Order>>> getKitchenOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getKitchenOrders(), "Active kitchen orders retrieved"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Get all orders in system (Staff/Admin)")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders(), "All orders retrieved"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Update order status (e.g. ACCEPTED, PREPARING, READY, COLLECTED)")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {

        Order updated = orderService.updateOrderStatus(id, request.getStatus(), request.getReason());
        return ResponseEntity.ok(ApiResponse.success(updated, "Order status updated to " + request.getStatus()));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an eligible order before preparation starts")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id,
            @Valid @RequestBody OrderCancelRequest request) {

        Order cancelled = orderService.cancelOrder(id, userPrincipal.getId(), request.getReason());
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Order cancelled successfully"));
    }

    @GetMapping("/lookup/qr")
    @Operation(summary = "Lookup order details by QR identifier without modifying status")
    public ResponseEntity<ApiResponse<Order>> lookupByQr(@RequestParam String qrIdentifier) {
        Order order = orderService.getOrderByQrIdentifier(qrIdentifier);
        return ResponseEntity.ok(ApiResponse.success(order, "Order details retrieved from QR"));
    }

    @GetMapping("/lookup/token")
    @Operation(summary = "Lookup order details by token without modifying status")
    public ResponseEntity<ApiResponse<Order>> lookupByToken(
            @RequestParam String tokenNumber,
            @RequestParam(required = false) String date) {
        Order order = orderService.getOrderByToken(tokenNumber, date);
        return ResponseEntity.ok(ApiResponse.success(order, "Order details retrieved from token"));
    }

    @PostMapping("/verify/qr")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Verify customer QR Code and mark order collected at Quick Pickup Counter")
    public ResponseEntity<ApiResponse<Order>> verifyQr(@RequestParam String qrIdentifier) {
        Order order = orderService.verifyAndCollectByQr(qrIdentifier);
        return ResponseEntity.ok(ApiResponse.success(order, "QR Code verified! Food delivered to customer."));
    }

    @PostMapping("/verify/token")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Verify customer daily Token number (e.g. A014) and mark order collected")
    public ResponseEntity<ApiResponse<Order>> verifyToken(
            @RequestParam String tokenNumber,
            @RequestParam(required = false) String date) {
        Order order = orderService.verifyAndCollectByToken(tokenNumber, date);
        return ResponseEntity.ok(ApiResponse.success(order, "Token verified! Food delivered to customer."));
    }

    @PostMapping("/{id}/reorder")
    @Operation(summary = "Reorder a previous order with same items")
    public ResponseEntity<ApiResponse<Order>> reorder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        User user = authService.getCurrentUser(userPrincipal.getId());
        Order reordered = orderService.reorder(id, user);
        return ResponseEntity.ok(ApiResponse.success(reordered, "Reorder placed successfully!"));
    }
}
