package com.smartcanteen.service;

import com.smartcanteen.dto.OrderCreateRequest;
import com.smartcanteen.dto.OrderItemRequest;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.model.*;
import com.smartcanteen.repository.FoodRepository;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.util.QrCodeUtil;
import com.smartcanteen.util.TokenGeneratorUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final InventoryService inventoryService;
    private final PickupSlotService pickupSlotService;
    private final QueueService queueService;
    private final NotificationService notificationService;
    private final CouponService couponService;
    private final TokenGeneratorUtil tokenGeneratorUtil;
    private final WebSocketNotificationService wsService;

    public OrderService(OrderRepository orderRepository,
                        FoodRepository foodRepository,
                        InventoryService inventoryService,
                        PickupSlotService pickupSlotService,
                        QueueService queueService,
                        NotificationService notificationService,
                        CouponService couponService,
                        TokenGeneratorUtil tokenGeneratorUtil,
                        WebSocketNotificationService wsService) {
        this.orderRepository = orderRepository;
        this.foodRepository = foodRepository;
        this.inventoryService = inventoryService;
        this.pickupSlotService = pickupSlotService;
        this.queueService = queueService;
        this.notificationService = notificationService;
        this.couponService = couponService;
        this.tokenGeneratorUtil = tokenGeneratorUtil;
        this.wsService = wsService;
    }

    public Order createOrder(User user, OrderCreateRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order cannot be empty.");
        }

        // 1. Validate and atomically deduct inventory
        inventoryService.validateAndDeductStock(request.getItems());

        // 2. Build Order items and calculate subtotal
        List<OrderItem> orderItems = new ArrayList<>();
        double subtotal = 0.0;
        int maxPrepTime = 5;

        for (OrderItemRequest itemReq : request.getItems()) {
            Food food = foodRepository.findById(itemReq.getFoodId())
                    .orElseThrow(() -> new ResourceNotFoundException("Food not found: " + itemReq.getFoodId()));

            double itemSubtotal = food.getPrice() * itemReq.getQuantity();
            subtotal += itemSubtotal;

            if (food.getPreparationTimeMinutes() > maxPrepTime) {
                maxPrepTime = food.getPreparationTimeMinutes();
            }

            orderItems.add(OrderItem.builder()
                    .foodId(food.getId())
                    .foodName(food.getName())
                    .image(food.getImage())
                    .price(food.getPrice())
                    .quantity(itemReq.getQuantity())
                    .isVeg(food.isVeg())
                    .subtotal(itemSubtotal)
                    .build());
        }

        // 3. Apply coupon if provided
        double discount = 0.0;
        String appliedCoupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            discount = couponService.applyCoupon(request.getCouponCode(), subtotal);
            if (discount > 0) {
                appliedCoupon = request.getCouponCode().toUpperCase().trim();
            }
        }

        double tax = 0.0;
        double finalAmount = Math.max(0.0, subtotal - discount + tax);

        // 4. Reserve Pickup Slot if specified
        PickupSlot slot = null;
        String slotDate = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        String slotTimeLabel = "Immediate / Standard Queue";

        if (request.getPickupSlotId() != null && !request.getPickupSlotId().isBlank()) {
            slot = pickupSlotService.reserveSlot(request.getPickupSlotId());
            if (slot != null) {
                slotDate = slot.getDate();
                slotTimeLabel = slot.getLabel();
            }
        }

        // 5. Generate identifiers
        String orderNumber = tokenGeneratorUtil.generateOrderNumber();
        String tokenNumber = tokenGeneratorUtil.generateNextDailyToken(slotDate);
        String qrIdentifier = QrCodeUtil.generateUniqueQrIdentifier();
        String qrBase64 = QrCodeUtil.generateQrBase64Image(qrIdentifier, 300, 300);

        // 6. Queue position and preparation time
        int totalActive = orderRepository.findActiveQueueOrders().size();
        int queuePos = totalActive + 1;
        int estimatedMinutes = queueService.calculateEstimatedWaitMinutes(queuePos, orderItems.size());
        Instant estimatedReadyTime = Instant.now().plus(estimatedMinutes, ChronoUnit.MINUTES);

        // 7. Assemble Order entity
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .userPhone(user.getPhone())
                .userRole(user.getRole())
                .items(orderItems)
                .subtotal(subtotal)
                .discount(discount)
                .couponCode(appliedCoupon)
                .tax(tax)
                .finalAmount(finalAmount)
                .tokenNumber(tokenNumber)
                .qrCodeIdentifier(qrIdentifier)
                .qrCodePayload(qrBase64)
                .pickupSlotId(slot != null ? slot.getId() : null)
                .pickupSlotTime(slotTimeLabel)
                .pickupSlotDate(slotDate)
                .status(OrderStatus.PLACED)
                .paymentStatus(PaymentStatus.PENDING)
                .queuePosition(queuePos)
                .estimatedReadyTime(estimatedReadyTime)
                .notes(request.getNotes())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        // 8. Notifications and WebSocket updates
        notificationService.sendNotification(
                user.getId(),
                "Order Placed #" + savedOrder.getTokenNumber(),
                "Your order has been received. Token: " + savedOrder.getTokenNumber() + ". Complete payment to confirm.",
                "ORDER_PLACED",
                savedOrder.getId(),
                savedOrder.getTokenNumber()
        );

        wsService.notifyKitchen(savedOrder);
        queueService.broadcastQueueChange();

        return savedOrder;
    }

    public Order updateOrderStatus(String orderId, OrderStatus newStatus, String reason) {
        Order order = getOrderById(orderId);
        OrderStatus oldStatus = order.getStatus();

        if (oldStatus == newStatus) {
            return order;
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(Instant.now());

        switch (newStatus) {
            case PAYMENT_CONFIRMED:
                order.setPaymentStatus(PaymentStatus.SUCCESS);
                notificationService.sendNotification(
                        order.getUserId(),
                        "Payment Confirmed #" + order.getTokenNumber(),
                        "Payment verified. Your food is queued for preparation.",
                        "PAYMENT_CONFIRMED",
                        order.getId(),
                        order.getTokenNumber()
                );
                break;

            case ACCEPTED:
                order.setAcceptedAt(Instant.now());
                notificationService.sendNotification(
                        order.getUserId(),
                        "Order Accepted #" + order.getTokenNumber(),
                        "Kitchen staff accepted your order.",
                        "ACCEPTED",
                        order.getId(),
                        order.getTokenNumber()
                );
                break;

            case PREPARING:
                order.setPreparingAt(Instant.now());
                int prepMinutes = order.getItems().stream()
                        .mapToInt(i -> 6)
                        .max().orElse(8);
                order.setEstimatedReadyTime(Instant.now().plus(prepMinutes, ChronoUnit.MINUTES));

                notificationService.sendNotification(
                        order.getUserId(),
                        "Preparing Your Food #" + order.getTokenNumber(),
                        "Your meal is now sizzling on the grill!",
                        "PREPARING",
                        order.getId(),
                        order.getTokenNumber()
                );
                break;

            case READY:
                order.setReadyAt(Instant.now());
                order.setQueuePosition(0);
                notificationService.sendNotification(
                        order.getUserId(),
                        "🟢 Food Ready for Pickup! #" + order.getTokenNumber(),
                        "Your order is ready! Head directly to Quick Pickup Counter 2 and show your QR code.",
                        "READY",
                        order.getId(),
                        order.getTokenNumber()
                );
                break;

            case COLLECTED:
            case COMPLETED:
                order.setCollectedAt(Instant.now());
                order.setQueuePosition(0);
                notificationService.sendNotification(
                        order.getUserId(),
                        "Order Collected #" + order.getTokenNumber(),
                        "Enjoy your meal! Please take a moment to rate your food.",
                        "COLLECTED",
                        order.getId(),
                        order.getTokenNumber()
                );
                break;

            case CANCELLED:
            case REJECTED:
            case REFUNDED:
                order.setCancelledAt(Instant.now());
                order.setCancellationReason(reason != null ? reason : "Cancelled");
                inventoryService.restoreStock(order.getItems());
                if (order.getPickupSlotId() != null) {
                    pickupSlotService.releaseSlot(order.getPickupSlotId());
                }
                notificationService.sendNotification(
                        order.getUserId(),
                        "Order " + newStatus.name() + " #" + order.getTokenNumber(),
                        "Reason: " + order.getCancellationReason(),
                        "CANCELLED",
                        order.getId(),
                        order.getTokenNumber()
                );
                break;

            default:
                break;
        }

        Order saved = orderRepository.save(order);

        wsService.notifyOrderStatusChange(saved.getId(), saved);
        wsService.notifyKitchen(saved);
        queueService.broadcastQueueChange();

        return saved;
    }

    public Order verifyAndCollectByQr(String qrIdentifier) {
        if (qrIdentifier == null || qrIdentifier.isBlank()) {
            throw new BadRequestException("QR identifier is empty.");
        }

        Order order = orderRepository.findByQrCodeIdentifier(qrIdentifier.trim())
                .orElseThrow(() -> new BadRequestException("Invalid QR Code. No matching order found."));

        if (order.getStatus() == OrderStatus.COLLECTED || order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Order Already Collected (Token: " + order.getTokenNumber() + ")");
        }

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.REJECTED) {
            throw new BadRequestException("Cannot collect cancelled or rejected order.");
        }

        return updateOrderStatus(order.getId(), OrderStatus.COLLECTED, "Collected via QR scan at Quick Pickup counter");
    }

    public Order getOrderByQrIdentifier(String qrIdentifier) {
        if (qrIdentifier == null || qrIdentifier.isBlank()) {
            throw new BadRequestException("QR identifier is empty.");
        }
        return orderRepository.findByQrCodeIdentifier(qrIdentifier.trim())
                .orElseThrow(() -> new ResourceNotFoundException("No order found with QR identifier: " + qrIdentifier.trim()));
    }

    public Order getOrderByToken(String tokenNumber, String date) {
        if (tokenNumber == null || tokenNumber.isBlank()) {
            throw new BadRequestException("Token number is empty.");
        }
        final String queryDate = (date != null && !date.isBlank()) ? date : LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        return orderRepository.findByTokenNumberAndPickupSlotDate(tokenNumber.toUpperCase().trim(), queryDate)
                .orElseThrow(() -> new ResourceNotFoundException("No order found with token '" + tokenNumber + "' for " + queryDate));
    }

    public Order verifyAndCollectByToken(String tokenNumber, String date) {
        final String queryDate = (date != null && !date.isBlank()) ? date : LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);

        Order order = orderRepository.findByTokenNumberAndPickupSlotDate(tokenNumber.toUpperCase().trim(), queryDate)
                .orElseThrow(() -> new BadRequestException("Token '" + tokenNumber + "' not found for today."));

        if (order.getStatus() == OrderStatus.COLLECTED || order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Order Already Collected for token " + tokenNumber);
        }

        return updateOrderStatus(order.getId(), OrderStatus.COLLECTED, "Collected via token lookup");
    }

    public Order cancelOrder(String orderId, String userId, String reason) {
        Order order = getOrderById(orderId);

        if (!order.getUserId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own orders.");
        }

        if (order.getStatus() == OrderStatus.PREPARING || order.getStatus() == OrderStatus.READY || order.getStatus() == OrderStatus.COLLECTED) {
            throw new BadRequestException("Cannot cancel order while it is " + order.getStatus() + ". Preparation has already started.");
        }

        return updateOrderStatus(order.getId(), OrderStatus.CANCELLED, reason);
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getUserActiveOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(o -> o.getStatus() != OrderStatus.COLLECTED
                        && o.getStatus() != OrderStatus.COMPLETED
                        && o.getStatus() != OrderStatus.CANCELLED
                        && o.getStatus() != OrderStatus.REJECTED
                        && o.getStatus() != OrderStatus.REFUNDED)
                .toList();
    }

    public List<Order> getKitchenOrders() {
        return orderRepository.findByStatusInOrderByCreatedAtAsc(
                Arrays.asList(OrderStatus.PLACED, OrderStatus.PAYMENT_CONFIRMED, OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY)
        );
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order reorder(String orderId, User user) {
        Order original = getOrderById(orderId);
        List<OrderItemRequest> itemRequests = new ArrayList<>();
        for (OrderItem item : original.getItems()) {
            itemRequests.add(new OrderItemRequest(item.getFoodId(), item.getQuantity()));
        }

        OrderCreateRequest request = OrderCreateRequest.builder()
                .items(itemRequests)
                .pickupSlotId(null)
                .couponCode(original.getCouponCode())
                .notes("Reorder of #" + original.getTokenNumber())
                .build();

        return createOrder(user, request);
    }
}
