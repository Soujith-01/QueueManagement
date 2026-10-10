package com.smartcanteen.service;

import com.smartcanteen.dto.FoodRequest;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.model.Food;
import com.smartcanteen.repository.FoodRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final WebSocketNotificationService wsService;

    public FoodService(FoodRepository foodRepository, WebSocketNotificationService wsService) {
        this.foodRepository = foodRepository;
        this.wsService = wsService;
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public List<Food> getAvailableFoods() {
        return foodRepository.findByIsAvailableTrue();
    }

    public Food getFoodById(String id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
    }

    public List<Food> getFoodsByCategory(String category) {
        return foodRepository.findByCategory(category);
    }

    public List<Food> searchFoods(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return foodRepository.findByIsAvailableTrue();
        }
        return foodRepository.searchByName(keyword.trim());
    }

    public List<Food> getPopularFoods() {
        return foodRepository.findTop8ByOrderBySoldCountDesc();
    }

    public Food createFood(FoodRequest request) {
        Food food = Food.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .image(request.getImage())
                .stock(request.getStock())
                .initialStock(request.getStock())
                .preparationTimeMinutes(request.getPreparationTimeMinutes() > 0 ? request.getPreparationTimeMinutes() : 8)
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : (request.getStock() > 0))
                .isVeg(request.getIsVeg() != null ? request.getIsVeg() : true)
                .tags(request.getTags())
                .isSpecialToday(request.getIsSpecialToday() != null ? request.getIsSpecialToday() : false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Food saved = foodRepository.save(food);
        wsService.notifyInventoryUpdate(saved);
        return saved;
    }

    public Food updateFood(String id, FoodRequest request) {
        Food food = getFoodById(id);
        food.setName(request.getName().trim());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setCategory(request.getCategory());
        if (request.getImage() != null) food.setImage(request.getImage());
        food.setStock(request.getStock());
        if (request.getStock() > food.getInitialStock()) {
            food.setInitialStock(request.getStock());
        }
        food.setPreparationTimeMinutes(request.getPreparationTimeMinutes());
        food.setAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : (food.getStock() > 0));
        if (request.getIsVeg() != null) food.setVeg(request.getIsVeg());
        if (request.getTags() != null) food.setTags(request.getTags());
        if (request.getIsSpecialToday() != null) food.setSpecialToday(request.getIsSpecialToday());
        food.setUpdatedAt(Instant.now());

        Food saved = foodRepository.save(food);
        wsService.notifyInventoryUpdate(saved);
        return saved;
    }

    public void deleteFood(String id) {
        Food food = getFoodById(id);
        foodRepository.delete(food);
        wsService.notifyInventoryUpdate(food);
    }
}
