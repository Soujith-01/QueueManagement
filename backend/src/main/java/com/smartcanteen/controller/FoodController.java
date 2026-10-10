package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.dto.FoodRequest;
import com.smartcanteen.model.Food;
import com.smartcanteen.service.FoodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@Tag(name = "Food Menu", description = "Food browsing, searching, and admin food management")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping
    @Operation(summary = "Get all food items or filter by availability/category/search")
    public ResponseEntity<ApiResponse<List<Food>>> getFoods(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly) {

        List<Food> result;
        if (search != null && !search.isBlank()) {
            result = foodService.searchFoods(search);
        } else if (category != null && !category.isBlank()) {
            result = foodService.getFoodsByCategory(category);
        } else if (availableOnly) {
            result = foodService.getAvailableFoods();
        } else {
            result = foodService.getAllFoods();
        }

        return ResponseEntity.ok(ApiResponse.success(result, "Foods retrieved"));
    }

    @GetMapping("/popular")
    @Operation(summary = "Get today's top popular food items")
    public ResponseEntity<ApiResponse<List<Food>>> getPopularFoods() {
        return ResponseEntity.ok(ApiResponse.success(foodService.getPopularFoods(), "Popular foods retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single food item details by ID")
    public ResponseEntity<ApiResponse<Food>> getFoodById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(foodService.getFoodById(id), "Food details retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Create a new food item (Canteen Admin / Super Admin)")
    public ResponseEntity<ApiResponse<Food>> createFood(@Valid @RequestBody FoodRequest request) {
        Food created = foodService.createFood(request);
        return ResponseEntity.ok(ApiResponse.success(created, "Food item created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Update food item (Canteen Admin / Super Admin)")
    public ResponseEntity<ApiResponse<Food>> updateFood(@PathVariable String id, @Valid @RequestBody FoodRequest request) {
        Food updated = foodService.updateFood(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Food item updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Delete food item (Canteen Admin / Super Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteFood(@PathVariable String id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Food item deleted successfully"));
    }
}
