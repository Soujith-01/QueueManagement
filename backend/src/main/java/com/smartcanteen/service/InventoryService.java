package com.smartcanteen.service;

import com.smartcanteen.dto.OrderItemRequest;
import com.smartcanteen.exception.InsufficientStockException;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.model.Food;
import com.smartcanteen.model.OrderItem;
import com.smartcanteen.repository.FoodRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    private final FoodRepository foodRepository;
    private final MongoTemplate mongoTemplate;
    private final WebSocketNotificationService wsService;

    public InventoryService(FoodRepository foodRepository, MongoTemplate mongoTemplate, WebSocketNotificationService wsService) {
        this.foodRepository = foodRepository;
        this.mongoTemplate = mongoTemplate;
        this.wsService = wsService;
    }

    public synchronized void validateAndDeductStock(List<OrderItemRequest> itemRequests) {
        // Pre-check all items first
        for (OrderItemRequest req : itemRequests) {
            Food food = foodRepository.findById(req.getFoodId())
                    .orElseThrow(() -> new ResourceNotFoundException("Food not found: " + req.getFoodId()));

            if (!food.isAvailable() || food.getStock() < req.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for '" + food.getName() + "'. Available: " + food.getStock() + ", Requested: " + req.getQuantity());
            }
        }

        // Deduct atomically using MongoDB update
        for (OrderItemRequest req : itemRequests) {
            Query query = new Query(Criteria.where("id").is(req.getFoodId())
                    .and("stock").gte(req.getQuantity()));

            Update update = new Update()
                    .inc("stock", -req.getQuantity())
                    .inc("soldCount", req.getQuantity())
                    .set("updatedAt", Instant.now());

            Food updatedFood = mongoTemplate.findAndModify(query, update, Food.class);
            if (updatedFood == null) {
                throw new InsufficientStockException("Stock changed concurrently for item ID: " + req.getFoodId() + ". Please retry.");
            }

            // Check if stock has now become 0, mark unavailable
            if (updatedFood.getStock() - req.getQuantity() <= 0) {
                mongoTemplate.updateFirst(
                        new Query(Criteria.where("id").is(req.getFoodId())),
                        new Update().set("isAvailable", false),
                        Food.class
                );
            }

            Food fresh = foodRepository.findById(req.getFoodId()).orElse(null);
            if (fresh != null) {
                wsService.notifyInventoryUpdate(fresh);
            }
        }
    }

    public synchronized void restoreStock(List<OrderItem> items) {
        if (items == null) return;
        for (OrderItem item : items) {
            Query query = new Query(Criteria.where("id").is(item.getFoodId()));
            Update update = new Update()
                    .inc("stock", item.getQuantity())
                    .inc("soldCount", -item.getQuantity())
                    .set("isAvailable", true)
                    .set("updatedAt", Instant.now());

            mongoTemplate.updateFirst(query, update, Food.class);
            Food fresh = foodRepository.findById(item.getFoodId()).orElse(null);
            if (fresh != null) {
                wsService.notifyInventoryUpdate(fresh);
            }
        }
    }

    public Food updateStock(String foodId, int newStock) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found: " + foodId));

        food.setStock(Math.max(0, newStock));
        food.setAvailable(newStock > 0);
        food.setUpdatedAt(Instant.now());

        Food saved = foodRepository.save(food);
        wsService.notifyInventoryUpdate(saved);
        return saved;
    }

    public Food toggleAvailability(String foodId) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found: " + foodId));

        food.setAvailable(!food.isAvailable());
        food.setUpdatedAt(Instant.now());

        Food saved = foodRepository.save(food);
        wsService.notifyInventoryUpdate(saved);
        return saved;
    }
}
