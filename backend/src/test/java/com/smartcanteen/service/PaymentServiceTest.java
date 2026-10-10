package com.smartcanteen.service;

import com.razorpay.RazorpayClient;
import com.smartcanteen.dto.PaymentCreateOrderRequest;
import com.smartcanteen.dto.PaymentResponse;
import com.smartcanteen.dto.PaymentVerifyRequest;
import com.smartcanteen.exception.PaymentVerificationException;
import com.smartcanteen.model.Order;
import com.smartcanteen.model.OrderStatus;
import com.smartcanteen.model.Payment;
import com.smartcanteen.model.PaymentStatus;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RazorpayClient razorpayClient;

    @InjectMocks
    private PaymentService paymentService;

    private Order order;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(paymentService, "keyId", "rzp_test_dummy_key");
        ReflectionTestUtils.setField(paymentService, "keySecret", "rzp_secret_dummy");

        order = Order.builder()
                .id("order-101")
                .orderNumber("ORD-101")
                .tokenNumber("A005")
                .userId("u1")
                .finalAmount(150.0)
                .paymentStatus(PaymentStatus.PENDING)
                .status(OrderStatus.PLACED)
                .build();
    }

    @Test
    @DisplayName("Should create payment order and link paymentId to the Order")
    void testCreatePaymentOrder() {
        when(orderService.getOrderById("order-101")).thenReturn(order);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment p = invocation.getArgument(0);
            p.setId("pay-doc-1");
            return p;
        });

        PaymentResponse response = paymentService.createPaymentOrder(new PaymentCreateOrderRequest("order-101"));

        assertNotNull(response);
        assertEquals("order-101", response.getOrderId());
        assertEquals("pay-doc-1", response.getPaymentId());
        assertEquals(150.0, response.getAmount());
        assertEquals(PaymentStatus.PENDING, response.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    @DisplayName("Should verify simulated demo payment and update order to PAYMENT_CONFIRMED")
    void testVerifyDemoPayment() {
        when(orderService.getOrderById("order-101")).thenReturn(order);
        when(paymentRepository.findByRazorpayOrderId("order_demo_123456")).thenReturn(Optional.of(
                Payment.builder().id("pay-doc-1").razorpayOrderId("order_demo_123456").amount(150.0).build()
        ));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentVerifyRequest verifyReq = new PaymentVerifyRequest();
        verifyReq.setOrderId("order-101");
        verifyReq.setRazorpayOrderId("order_demo_123456");
        verifyReq.setRazorpayPaymentId("pay_demo_987654");
        verifyReq.setRazorpaySignature("mock_sig");

        PaymentResponse response = paymentService.verifyPayment(verifyReq);

        assertNotNull(response);
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        verify(orderService, times(1)).updateOrderStatus(eq("order-101"), eq(OrderStatus.PAYMENT_CONFIRMED), anyString());
    }

    @Test
    @DisplayName("Should process payment idempotent callback when already verified")
    void testVerifyPaymentIdempotency() {
        order.setPaymentStatus(PaymentStatus.SUCCESS);
        when(orderService.getOrderById("order-101")).thenReturn(order);
        when(paymentRepository.findByRazorpayOrderId("order_demo_123456")).thenReturn(Optional.of(
                Payment.builder().id("pay-doc-1").razorpayOrderId("order_demo_123456").amount(150.0).build()
        ));

        PaymentVerifyRequest verifyReq = new PaymentVerifyRequest();
        verifyReq.setOrderId("order-101");
        verifyReq.setRazorpayOrderId("order_demo_123456");

        PaymentResponse response = paymentService.verifyPayment(verifyReq);

        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        verify(orderService, never()).updateOrderStatus(anyString(), any(), anyString());
    }

    @Test
    @DisplayName("Should process refund and transition Order to REFUNDED")
    void testRefundPayment() {
        Payment payment = Payment.builder().id("pay-1").orderId("order-101").status(PaymentStatus.SUCCESS).build();
        when(orderService.getOrderById("order-101")).thenReturn(order);
        when(paymentRepository.findByOrderId("order-101")).thenReturn(Optional.of(payment));

        PaymentResponse response = paymentService.refundPayment("order-101", "Customer cancellation");

        assertEquals(PaymentStatus.REFUNDED, response.getStatus());
        assertEquals(PaymentStatus.REFUNDED, payment.getStatus());
        verify(paymentRepository, times(1)).save(payment);
        verify(orderService, times(1)).updateOrderStatus("order-101", OrderStatus.REFUNDED, "Customer cancellation");
    }
}
