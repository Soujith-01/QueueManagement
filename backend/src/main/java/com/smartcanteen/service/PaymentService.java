package com.smartcanteen.service;

import com.razorpay.RazorpayClient;
import com.smartcanteen.dto.PaymentCreateOrderRequest;
import com.smartcanteen.dto.PaymentResponse;
import com.smartcanteen.dto.PaymentVerifyRequest;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.exception.PaymentVerificationException;
import com.smartcanteen.model.Order;
import com.smartcanteen.model.OrderStatus;
import com.smartcanteen.model.Payment;
import com.smartcanteen.model.PaymentStatus;
import com.smartcanteen.repository.PaymentRepository;
import com.smartcanteen.util.SignatureVerifierUtil;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final OrderService orderService;
    private final com.smartcanteen.repository.OrderRepository orderRepository;
    private final RazorpayClient razorpayClient;

    @Value("${app.razorpay.key-id:rzp_test_college_canteen_dummy_key}")
    private String keyId;

    @Value("${app.razorpay.key-secret:rzp_test_secret_demo_12345}")
    private String keySecret;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderService orderService,
                          com.smartcanteen.repository.OrderRepository orderRepository,
                          RazorpayClient razorpayClient) {
        this.paymentRepository = paymentRepository;
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.razorpayClient = razorpayClient;
    }

    public PaymentResponse createPaymentOrder(PaymentCreateOrderRequest request) {
        Order order = orderService.getOrderById(request.getOrderId());

        if (order.getPaymentStatus() == PaymentStatus.SUCCESS) {
            throw new BadRequestException("Order is already paid.");
        }

        double amountInRupees = order.getFinalAmount();
        long amountInPaise = Math.round(amountInRupees * 100);

        String razorpayOrderId;
        boolean isDemo = false;

        try {
            if (razorpayClient != null && !keyId.contains("dummy")) {
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", order.getOrderNumber());
                com.razorpay.Order rzpOrder = razorpayClient.orders.create(orderRequest);
                razorpayOrderId = rzpOrder.get("id");
            } else {
                razorpayOrderId = "order_demo_" + UUID.randomUUID().toString().substring(0, 14);
                isDemo = true;
            }
        } catch (Exception e) {
            log.warn("Razorpay API call failed, falling back to simulated order id: {}", e.getMessage());
            razorpayOrderId = "order_demo_" + UUID.randomUUID().toString().substring(0, 14);
            isDemo = true;
        }

        Payment payment = Payment.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .razorpayOrderId(razorpayOrderId)
                .amount(amountInRupees)
                .currency("INR")
                .status(PaymentStatus.PENDING)
                .createdAt(Instant.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        order.setPaymentId(savedPayment.getId());
        orderRepository.save(order);

        return PaymentResponse.builder()
                .paymentId(savedPayment.getId())
                .orderId(order.getId())
                .razorpayOrderId(razorpayOrderId)
                .amount(amountInRupees)
                .currency("INR")
                .keyId(keyId)
                .status(PaymentStatus.PENDING)
                .tokenNumber(order.getTokenNumber())
                .qrCodeIdentifier(order.getQrCodeIdentifier())
                .qrCodePayload(order.getQrCodePayload())
                .isDemoPayment(isDemo)
                .build();
    }

    public PaymentResponse verifyPayment(PaymentVerifyRequest request) {
        Order order = orderService.getOrderById(request.getOrderId());

        // Idempotency: If already verified, return successful response immediately
        if (order.getPaymentStatus() == PaymentStatus.SUCCESS) {
            Payment existing = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElse(null);
            return PaymentResponse.builder()
                    .paymentId(existing != null ? existing.getId() : order.getPaymentId())
                    .orderId(order.getId())
                    .razorpayOrderId(request.getRazorpayOrderId())
                    .amount(order.getFinalAmount())
                    .currency("INR")
                    .keyId(keyId)
                    .status(PaymentStatus.SUCCESS)
                    .tokenNumber(order.getTokenNumber())
                    .qrCodeIdentifier(order.getQrCodeIdentifier())
                    .qrCodePayload(order.getQrCodePayload())
                    .isDemoPayment(request.getRazorpayOrderId() != null && request.getRazorpayOrderId().startsWith("order_demo_"))
                    .build();
        }

        boolean isDemoOrder = request.getRazorpayOrderId() != null && request.getRazorpayOrderId().startsWith("order_demo_");
        boolean signatureValid = false;

        if (isDemoOrder) {
            signatureValid = true;
        } else {
            signatureValid = SignatureVerifierUtil.verifyRazorpaySignature(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature(),
                    keySecret
            );
        }

        if (!signatureValid) {
            throw new PaymentVerificationException("Invalid payment signature. Verification failed.");
        }

        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseGet(() -> Payment.builder()
                        .orderId(order.getId())
                        .userId(order.getUserId())
                        .razorpayOrderId(request.getRazorpayOrderId())
                        .amount(order.getFinalAmount())
                        .currency("INR")
                        .createdAt(Instant.now())
                        .build());

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        Payment savedPayment = paymentRepository.save(payment);

        // Update Order status to PAYMENT_CONFIRMED
        orderService.updateOrderStatus(order.getId(), OrderStatus.PAYMENT_CONFIRMED, "Payment verified successfully");

        return PaymentResponse.builder()
                .paymentId(savedPayment.getId())
                .orderId(order.getId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .keyId(keyId)
                .status(PaymentStatus.SUCCESS)
                .tokenNumber(order.getTokenNumber())
                .qrCodeIdentifier(order.getQrCodeIdentifier())
                .qrCodePayload(order.getQrCodePayload())
                .isDemoPayment(isDemoOrder)
                .build();
    }

    public PaymentResponse refundPayment(String orderId, String reason) {
        Order order = orderService.getOrderById(orderId);
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElse(null);

        if (payment != null) {
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
        }

        orderService.updateOrderStatus(order.getId(), OrderStatus.REFUNDED, reason != null ? reason : "Payment refunded");

        return PaymentResponse.builder()
                .paymentId(payment != null ? payment.getId() : null)
                .orderId(order.getId())
                .amount(order.getFinalAmount())
                .currency("INR")
                .status(PaymentStatus.REFUNDED)
                .tokenNumber(order.getTokenNumber())
                .build();
    }
}
