package com.smartcanteen.service;

import com.smartcanteen.dto.OrderCancelRequest;
import com.smartcanteen.dto.OrderCreateRequest;
import com.smartcanteen.dto.OrderItemRequest;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.model.*;
import com.smartcanteen.repository.FoodRepository;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.util.TokenGeneratorUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private FoodRepository foodRepository;

    @Mock
    private InventoryService inventoryService;

    @Mock
    private PickupSlotService pickupSlotService;

    @Mock
    private QueueService queueService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private CouponService couponService;

    @Mock
    private TokenGeneratorUtil tokenGeneratorUtil;

    @Mock
    private WebSocketNotificationService wsService;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private Food masalaDosa;
    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id("u1")
                .name("Alice")
                .email("alice@canteen.com")
                .role(Role.STUDENT)
                .build();

        masalaDosa = Food.builder()
                .id("f1")
                .name("Masala Dosa")
                .price(60.0)
                .stock(20)
                .preparationTimeMinutes(8)
                .isAvailable(true)
                .build();

        OrderItem item = OrderItem.builder()
                .foodId("f1")
                .foodName("Masala Dosa")
                .price(60.0)
                .quantity(1)
                .subtotal(60.0)
                .build();

        sampleOrder = Order.builder()
                .id("order-100")
                .orderNumber("ORD-2026-001")
                .tokenNumber("A001")
                .qrCodeIdentifier("QR-ABC-123")
                .userId("u1")
                .items(List.of(item))
                .finalAmount(60.0)
                .status(OrderStatus.READY)
                .pickupSlotDate("2026-10-10")
                .build();
    }

    @Test
    @DisplayName("Should successfully create order, deduct stock, and return saved order with token")
    void testCreateOrderSuccess() {
        OrderCreateRequest request = OrderCreateRequest.builder()
                .items(List.of(new OrderItemRequest("f1", 2)))
                .build();

        when(foodRepository.findById("f1")).thenReturn(Optional.of(masalaDosa));
        when(tokenGeneratorUtil.generateOrderNumber()).thenReturn("ORD-2026-123");
        when(tokenGeneratorUtil.generateNextDailyToken(anyString())).thenReturn("A015");
        when(orderRepository.findActiveQueueOrders()).thenReturn(Collections.emptyList());
        when(queueService.calculateEstimatedWaitMinutes(anyInt(), anyInt())).thenReturn(10);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order created = orderService.createOrder(user, request);

        assertNotNull(created);
        assertEquals("A015", created.getTokenNumber());
        assertEquals(120.0, created.getFinalAmount());
        assertEquals(OrderStatus.PLACED, created.getStatus());
        verify(inventoryService, times(1)).validateAndDeductStock(any());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    @DisplayName("Should verify QR and update status to COLLECTED at pickup counter")
    void testVerifyAndCollectByQrSuccess() {
        when(orderRepository.findByQrCodeIdentifier("QR-ABC-123")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order-100")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order collected = orderService.verifyAndCollectByQr("QR-ABC-123");

        assertEquals(OrderStatus.COLLECTED, collected.getStatus());
        assertNotNull(collected.getCollectedAt());
    }

    @Test
    @DisplayName("Should reject double pickup scan for already collected order")
    void testVerifyQrDoubleCollectionRejected() {
        sampleOrder.setStatus(OrderStatus.COLLECTED);
        when(orderRepository.findByQrCodeIdentifier("QR-ABC-123")).thenReturn(Optional.of(sampleOrder));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                orderService.verifyAndCollectByQr("QR-ABC-123")
        );

        assertTrue(ex.getMessage().contains("Already Collected"));
    }

    @Test
    @DisplayName("Should prevent cancellation once food preparation has started")
    void testCancelOrderFailsWhenPreparing() {
        sampleOrder.setStatus(OrderStatus.PREPARING);
        when(orderRepository.findById("order-100")).thenReturn(Optional.of(sampleOrder));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                orderService.cancelOrder("order-100", "u1", "Changed my mind")
        );

        assertTrue(ex.getMessage().contains("Cannot cancel order"));
    }

    @Test
    @DisplayName("Should successfully cancel order when still PLACED or ACCEPTED")
    void testCancelOrderSuccessWhenPlaced() {
        sampleOrder.setStatus(OrderStatus.PLACED);
        when(orderRepository.findById("order-100")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order cancelled = orderService.cancelOrder("order-100", "u1", "Emergency meeting");

        assertEquals(OrderStatus.CANCELLED, cancelled.getStatus());
        verify(inventoryService, times(1)).restoreStock(any());
    }
}
