package com.smartcanteen.service;

import com.smartcanteen.dto.QueueStatusResponse;
import com.smartcanteen.model.CanteenSettings;
import com.smartcanteen.model.Order;
import com.smartcanteen.model.OrderStatus;
import com.smartcanteen.repository.CanteenSettingsRepository;
import com.smartcanteen.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QueueServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CanteenSettingsRepository settingsRepository;

    @Mock
    private WebSocketNotificationService wsService;

    @InjectMocks
    private QueueService queueService;

    private CanteenSettings defaultSettings;

    @BeforeEach
    void setUp() {
        defaultSettings = CanteenSettings.builder()
                .id("GLOBAL_SETTINGS")
                .avgPrepTimeMinutes(8)
                .leaveNowAlertMinutes(5)
                .crowdThresholdMedium(15)
                .crowdThresholdHigh(30)
                .build();

        org.mockito.Mockito.lenient().when(settingsRepository.findById("GLOBAL_SETTINGS")).thenReturn(Optional.of(defaultSettings));
    }

    @Test
    @DisplayName("Should correctly identify queue position in order list")
    void testCalculateQueuePosition() {
        Order o1 = Order.builder().id("ord-1").status(OrderStatus.ACCEPTED).build();
        Order o2 = Order.builder().id("ord-2").status(OrderStatus.PREPARING).build();
        Order o3 = Order.builder().id("ord-3").status(OrderStatus.PLACED).build();

        when(orderRepository.findByStatusInOrderByCreatedAtAsc(any())).thenReturn(List.of(o1, o2, o3));

        assertEquals(1, queueService.calculateQueuePosition("ord-1"));
        assertEquals(2, queueService.calculateQueuePosition("ord-2"));
        assertEquals(3, queueService.calculateQueuePosition("ord-3"));
        assertEquals(0, queueService.calculateQueuePosition("ord-unknown"));
    }

    @Test
    @DisplayName("Should calculate parallel wait minutes proportionally")
    void testCalculateEstimatedWaitMinutes() {
        int wait1 = queueService.calculateEstimatedWaitMinutes(1, 1);
        int wait5 = queueService.calculateEstimatedWaitMinutes(5, 1);

        assertEquals(8, wait1);
        assertTrue(wait5 > wait1);
    }

    @Test
    @DisplayName("Should flag shouldLeaveNow when ready time is within threshold")
    void testShouldLeaveNow() {
        Order urgentOrder = Order.builder()
                .id("ord-urgent")
                .status(OrderStatus.PREPARING)
                .estimatedReadyTime(Instant.now().plus(3, ChronoUnit.MINUTES))
                .build();

        Order laterOrder = Order.builder()
                .id("ord-later")
                .status(OrderStatus.PREPARING)
                .estimatedReadyTime(Instant.now().plus(20, ChronoUnit.MINUTES))
                .build();

        assertTrue(queueService.shouldLeaveNow(urgentOrder));
        assertFalse(queueService.shouldLeaveNow(laterOrder));
    }

    @Test
    @DisplayName("Should generate current queue status with correct crowd levels")
    void testGetCurrentQueueStatus() {
        Order o1 = Order.builder().id("o1").tokenNumber("A001").status(OrderStatus.PREPARING).build();
        Order o2 = Order.builder().id("o2").tokenNumber("A002").status(OrderStatus.READY).build();

        when(orderRepository.findByStatusInOrderByCreatedAtAsc(List.of(OrderStatus.PREPARING)))
                .thenReturn(List.of(o1));
        when(orderRepository.findByStatusInOrderByCreatedAtAsc(List.of(OrderStatus.READY)))
                .thenReturn(List.of(o2));
        when(orderRepository.findActiveQueueOrders())
                .thenReturn(List.of(o1, o2));

        QueueStatusResponse status = queueService.getCurrentQueueStatus();

        assertNotNull(status);
        assertEquals(2, status.getTotalInQueue());
        assertEquals(1, status.getOrdersPreparing());
        assertEquals(1, status.getOrdersReady());
        assertEquals("LOW", status.getCrowdLevel());
        assertTrue(status.getReadyTokens().contains("A002"));
        assertTrue(status.getPreparingTokens().contains("A001"));
    }
}
