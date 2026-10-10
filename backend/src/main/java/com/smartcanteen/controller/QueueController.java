package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.dto.QueueStatusResponse;
import com.smartcanteen.model.CanteenSettings;
import com.smartcanteen.service.QueueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/queue")
@Tag(name = "Queue Management", description = "Real-time queue monitoring and estimation")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping("/current")
    @Operation(summary = "Get current live canteen queue status and crowd level")
    public ResponseEntity<ApiResponse<QueueStatusResponse>> getCurrentQueue() {
        QueueStatusResponse status = queueService.getCurrentQueueStatus();
        return ResponseEntity.ok(ApiResponse.success(status, "Current queue status retrieved"));
    }

    @GetMapping("/settings")
    @Operation(summary = "Get canteen configuration settings")
    public ResponseEntity<ApiResponse<CanteenSettings>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(queueService.getSettings(), "Canteen settings retrieved"));
    }

    @GetMapping({"/order/{orderId}", "/{orderId}"})
    @Operation(summary = "Get real-time queue position and Leave-Now status for a specific order")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getOrderQueue(@PathVariable String orderId) {
        int pos = queueService.calculateQueuePosition(orderId);
        int estWait = queueService.calculateEstimatedWaitMinutes(pos, 1);
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("orderId", orderId);
        data.put("queuePosition", pos);
        data.put("ordersAhead", Math.max(0, pos - 1));
        data.put("estimatedWaitMinutes", estWait);
        return ResponseEntity.ok(ApiResponse.success(data, "Order queue status retrieved"));
    }

    @GetMapping("/estimate")
    @Operation(summary = "Get current crowd prediction and waiting time estimate")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getQueueEstimate() {
        QueueStatusResponse status = queueService.getCurrentQueueStatus();
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("estimatedWaitMinutes", status.getEstimatedWaitMinutes());
        data.put("crowdLevel", status.getCrowdLevel());
        data.put("ordersInQueue", status.getTotalInQueue());
        data.put("recommendedPickupSlot", status.getRecommendedPickupSlot());
        return ResponseEntity.ok(ApiResponse.success(data, "Queue estimation retrieved"));
    }
}
