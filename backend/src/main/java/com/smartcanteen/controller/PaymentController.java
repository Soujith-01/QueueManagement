package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.dto.PaymentCreateOrderRequest;
import com.smartcanteen.dto.PaymentResponse;
import com.smartcanteen.dto.PaymentVerifyRequest;
import com.smartcanteen.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Razorpay payment initiation and signature verification")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    @Operation(summary = "Create Razorpay Order for checkout")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPaymentOrder(@Valid @RequestBody PaymentCreateOrderRequest request) {
        PaymentResponse response = paymentService.createPaymentOrder(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Razorpay payment order initialized"));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment signature from checkout callback")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
        PaymentResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment verified successfully!"));
    }

    @PostMapping("/refund")
    @Operation(summary = "Process refund for cancelled order")
    public ResponseEntity<ApiResponse<PaymentResponse>> refundPayment(
            @RequestParam String orderId,
            @RequestParam(required = false, defaultValue = "Order cancelled") String reason) {
        PaymentResponse response = paymentService.refundPayment(orderId, reason);
        return ResponseEntity.ok(ApiResponse.success(response, "Refund processed successfully"));
    }
}
