package com.smartcanteen.service;

import com.smartcanteen.dto.OrderItemRequest;
import com.smartcanteen.exception.InsufficientStockException;
import com.smartcanteen.model.Food;
import com.smartcanteen.model.OrderItem;
import com.smartcanteen.repository.FoodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private FoodRepository foodRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private WebSocketNotificationService wsService;

    @InjectMocks
    private InventoryService inventoryService;

    private Food samosa;

    @BeforeEach
    void setUp() {
        samosa = Food.builder()
                .id("food-1")
                .name("Samosa (2 pcs)")
                .stock(10)
                .isAvailable(true)
                .price(30.0)
                .build();
    }

    @Test
    @DisplayName("Should successfully deduct stock when requested quantity is available")
    void testValidateAndDeductStockSuccess() {
        OrderItemRequest itemReq = new OrderItemRequest("food-1", 2);
        when(foodRepository.findById("food-1")).thenReturn(Optional.of(samosa));
        when(mongoTemplate.findAndModify(any(Query.class), any(Update.class), eq(Food.class))).thenReturn(samosa);

        inventoryService.validateAndDeductStock(List.of(itemReq));

        verify(mongoTemplate, times(1)).findAndModify(any(Query.class), any(Update.class), eq(Food.class));
        verify(wsService, times(1)).notifyInventoryUpdate(any(Food.class));
    }

    @Test
    @DisplayName("Should throw InsufficientStockException when requested quantity exceeds available stock")
    void testDeductStockExceedsAvailable() {
        OrderItemRequest itemReq = new OrderItemRequest("food-1", 15);
        when(foodRepository.findById("food-1")).thenReturn(Optional.of(samosa));

        InsufficientStockException ex = assertThrows(InsufficientStockException.class, () ->
                inventoryService.validateAndDeductStock(List.of(itemReq))
        );

        assertTrue(ex.getMessage().contains("Insufficient stock"));
        assertEquals(10, samosa.getStock()); // Untouched
        verify(mongoTemplate, never()).findAndModify(any(Query.class), any(Update.class), eq(Food.class));
    }

    @Test
    @DisplayName("Should set isAvailable to false when stock reaches 0")
    void testStockBecomesZeroMarksUnavailable() {
        OrderItemRequest itemReq = new OrderItemRequest("food-1", 10);
        when(foodRepository.findById("food-1")).thenReturn(Optional.of(samosa));
        when(mongoTemplate.findAndModify(any(Query.class), any(Update.class), eq(Food.class))).thenReturn(samosa);

        inventoryService.validateAndDeductStock(List.of(itemReq));

        verify(mongoTemplate, times(1)).updateFirst(any(Query.class), any(Update.class), eq(Food.class));
    }

    @Test
    @DisplayName("Should restore stock when order is cancelled")
    void testRestoreStock() {
        OrderItem item = OrderItem.builder()
                .foodId("food-1")
                .foodName("Samosa")
                .quantity(3)
                .build();

        when(foodRepository.findById("food-1")).thenReturn(Optional.of(samosa));

        inventoryService.restoreStock(List.of(item));

        verify(mongoTemplate, times(1)).updateFirst(any(Query.class), any(Update.class), eq(Food.class));
        verify(wsService, times(1)).notifyInventoryUpdate(any(Food.class));
    }
}
