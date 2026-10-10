package com.smartcanteen.service;

import com.smartcanteen.dto.QueueStatusResponse;
import com.smartcanteen.model.CanteenSettings;
import com.smartcanteen.model.Order;
import com.smartcanteen.model.OrderStatus;
import com.smartcanteen.repository.CanteenSettingsRepository;
import com.smartcanteen.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QueueService {

    private static final Logger log = LoggerFactory.getLogger(QueueService.class);

    private final OrderRepository orderRepository;
    private final CanteenSettingsRepository settingsRepository;
    private final WebSocketNotificationService wsService;

    public QueueService(OrderRepository orderRepository,
                        CanteenSettingsRepository settingsRepository,
                        WebSocketNotificationService wsService) {
        this.orderRepository = orderRepository;
        this.settingsRepository = settingsRepository;
        this.wsService = wsService;
    }

    public int calculateQueuePosition(String orderId) {
        List<OrderStatus> activeStatuses = Arrays.asList(OrderStatus.PLACED, OrderStatus.PAYMENT_CONFIRMED, OrderStatus.ACCEPTED, OrderStatus.PREPARING);
        List<Order> activeOrders = orderRepository.findByStatusInOrderByCreatedAtAsc(activeStatuses);

        int pos = 1;
        for (Order order : activeOrders) {
            if (order.getId().equals(orderId)) {
                return pos;
            }
            pos++;
        }
        return 0;
    }

    public int calculateEstimatedWaitMinutes(int queuePosition, int totalItems) {
        CanteenSettings settings = getSettings();
        int avgPrep = settings.getAvgPrepTimeMinutes();
        if (queuePosition <= 1) {
            return Math.max(2, avgPrep);
        }
        double parallelFactor = 2.5;
        int estimated = (int) Math.ceil((queuePosition * avgPrep) / parallelFactor);
        return Math.max(3, estimated);
    }

    public boolean shouldLeaveNow(Order order) {
        if (order.getStatus() != OrderStatus.PREPARING && order.getStatus() != OrderStatus.ACCEPTED) {
            return false;
        }
        if (order.getEstimatedReadyTime() == null) {
            return false;
        }

        CanteenSettings settings = getSettings();
        long minutesUntilReady = (order.getEstimatedReadyTime().toEpochMilli() - Instant.now().toEpochMilli()) / (60 * 1000);
        return minutesUntilReady <= settings.getLeaveNowAlertMinutes();
    }

    public QueueStatusResponse getCurrentQueueStatus() {
        CanteenSettings settings = getSettings();
        List<Order> preparingOrders = orderRepository.findByStatusInOrderByCreatedAtAsc(List.of(OrderStatus.PREPARING));
        List<Order> readyOrders = orderRepository.findByStatusInOrderByCreatedAtAsc(List.of(OrderStatus.READY));
        List<Order> allQueueOrders = orderRepository.findActiveQueueOrders();

        int totalInQueue = allQueueOrders.size();
        int avgWait = calculateEstimatedWaitMinutes(totalInQueue, 1);

        String crowdLevel = "LOW";
        if (totalInQueue >= settings.getCrowdThresholdHigh()) {
            crowdLevel = "VERY_HIGH";
        } else if (totalInQueue >= settings.getCrowdThresholdMedium()) {
            crowdLevel = "HIGH";
        } else if (totalInQueue >= 6) {
            crowdLevel = "MEDIUM";
        }

        List<String> readyTokens = readyOrders.stream()
                .map(Order::getTokenNumber)
                .filter(t -> t != null && !t.isBlank())
                .collect(Collectors.toList());

        List<String> preparingTokens = preparingOrders.stream()
                .map(Order::getTokenNumber)
                .filter(t -> t != null && !t.isBlank())
                .collect(Collectors.toList());

        return QueueStatusResponse.builder()
                .totalInQueue(totalInQueue)
                .ordersPreparing(preparingOrders.size())
                .ordersReady(readyOrders.size())
                .estimatedWaitMinutes(avgWait)
                .crowdLevel(crowdLevel)
                .recommendedPickupSlot("Next available 10-min slot")
                .announcementBanner(settings.getAnnouncementBanner())
                .readyTokens(readyTokens)
                .preparingTokens(preparingTokens)
                .build();
    }

    public void broadcastQueueChange() {
        QueueStatusResponse status = getCurrentQueueStatus();
        wsService.notifyQueueUpdate(status);
    }

    public CanteenSettings getSettings() {
        return settingsRepository.findById("GLOBAL_SETTINGS")
                .orElseGet(() -> settingsRepository.save(CanteenSettings.builder().id("GLOBAL_SETTINGS").build()));
    }
}
