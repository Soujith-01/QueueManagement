package com.smartcanteen.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketNotificationService {

    private static final Logger log = LoggerFactory.getLogger(WebSocketNotificationService.class);
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyOrderStatusChange(String orderId, Object payload) {
        log.info("Broadcasting order status update to /topic/orders/{}", orderId);
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, payload);
    }

    public void notifyQueueUpdate(Object payload) {
        log.info("Broadcasting queue update to /topic/queue");
        messagingTemplate.convertAndSend("/topic/queue", payload);
    }

    public void notifyKitchen(Object payload) {
        log.info("Broadcasting kitchen update to /topic/kitchen");
        messagingTemplate.convertAndSend("/topic/kitchen", payload);
    }

    public void notifyInventoryUpdate(Object payload) {
        log.info("Broadcasting inventory update to /topic/inventory");
        messagingTemplate.convertAndSend("/topic/inventory", payload);
    }

    public void notifyUser(String userId, Object payload) {
        log.info("Broadcasting notification to user /topic/user/{}", userId);
        messagingTemplate.convertAndSend("/topic/user/" + userId, payload);
    }
}
