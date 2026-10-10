package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.dto.ReviewRequest;
import com.smartcanteen.model.Review;
import com.smartcanteen.model.User;
import com.smartcanteen.security.UserPrincipal;
import com.smartcanteen.service.AuthService;
import com.smartcanteen.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews & Ratings", description = "Food reviews, ratings, and feedback")
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthService authService;

    public ReviewController(ReviewService reviewService, AuthService authService) {
        this.reviewService = reviewService;
        this.authService = authService;
    }

    @PostMapping
    @Operation(summary = "Submit a rating and review for a food item/completed order")
    public ResponseEntity<ApiResponse<Review>> addReview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ReviewRequest request) {

        User user = authService.getCurrentUser(userPrincipal.getId());
        Review review = reviewService.addReview(user, request);
        return ResponseEntity.ok(ApiResponse.success(review, "Thank you for your review!"));
    }

    @GetMapping("/food/{foodId}")
    @Operation(summary = "Get reviews for a specific food item")
    public ResponseEntity<ApiResponse<List<Review>>> getFoodReviews(@PathVariable String foodId) {
        List<Review> reviews = reviewService.getReviewsForFood(foodId);
        return ResponseEntity.ok(ApiResponse.success(reviews, "Food reviews retrieved"));
    }

    @GetMapping("/{foodId}")
    @Operation(summary = "Get reviews for a specific food item (alias)")
    public ResponseEntity<ApiResponse<List<Review>>> getFoodReviewsById(@PathVariable String foodId) {
        List<Review> reviews = reviewService.getReviewsForFood(foodId);
        return ResponseEntity.ok(ApiResponse.success(reviews, "Food reviews retrieved"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get all customer reviews (Super Admin only)")
    public ResponseEntity<ApiResponse<List<Review>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getAllReviews(), "All reviews retrieved"));
    }
}
