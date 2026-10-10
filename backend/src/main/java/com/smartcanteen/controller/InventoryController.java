package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.model.Food;
import com.smartcanteen.service.FoodService;
import com.smartcanteen.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "Stock management and real-time inventory adjustments")
public class InventoryController {

    private final InventoryService inventoryService;
    private final FoodService foodService;

    public InventoryController(InventoryService inventoryService, FoodService foodService) {
        this.inventoryService = inventoryService;
        this.foodService = foodService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Get all inventory items (Staff/Admin)")
    public ResponseEntity<ApiResponse<List<Food>>> getInventory() {
        return ResponseEntity.ok(ApiResponse.success(foodService.getAllFoods(), "Inventory retrieved"));
    }

    @PutMapping("/{foodId}/stock")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Update available stock for a food item (Staff/Admin)")
    public ResponseEntity<ApiResponse<Food>> updateStock(@PathVariable String foodId, @RequestParam int stock) {
        Food updated = inventoryService.updateStock(foodId, stock);
        return ResponseEntity.ok(ApiResponse.success(updated, "Stock updated to " + stock));
    }

    @PutMapping("/{foodId}/toggle")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Toggle food availability on/off (Staff/Admin)")
    public ResponseEntity<ApiResponse<Food>> toggleAvailability(@PathVariable String foodId) {
        Food updated = inventoryService.toggleAvailability(foodId);
        return ResponseEntity.ok(ApiResponse.success(updated, "Food availability toggled"));
    }

    @PutMapping("/{foodId}")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Update food inventory stock or availability directly (Staff/Admin)")
    public ResponseEntity<ApiResponse<Food>> updateInventory(
            @PathVariable String foodId,
            @RequestBody java.util.Map<String, Object> body) {
        Food food = foodService.getFoodById(foodId);
        if (body.containsKey("stock")) {
            int stock = ((Number) body.get("stock")).intValue();
            food = inventoryService.updateStock(foodId, stock);
        }
        if (body.containsKey("isAvailable")) {
            boolean available = Boolean.parseBoolean(body.get("isAvailable").toString());
            food.setAvailable(available);
            food = foodService.updateFood(foodId, com.smartcanteen.dto.FoodRequest.builder()
                    .name(food.getName())
                    .description(food.getDescription())
                    .price(food.getPrice())
                    .category(food.getCategory())
                    .image(food.getImage())
                    .stock(food.getStock())
                    .preparationTimeMinutes(food.getPreparationTimeMinutes())
                    .isAvailable(available)
                    .isVeg(food.isVeg())
                    .tags(food.getTags())
                    .isSpecialToday(food.isSpecialToday())
                    .build());
        }
        return ResponseEntity.ok(ApiResponse.success(food, "Inventory updated"));
    }
}
