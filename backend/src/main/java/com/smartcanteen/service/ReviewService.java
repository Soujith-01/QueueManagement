package com.smartcanteen.service;

import com.smartcanteen.dto.ReviewRequest;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.model.Food;
import com.smartcanteen.model.Review;
import com.smartcanteen.model.User;
import com.smartcanteen.repository.FoodRepository;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final FoodRepository foodRepository;
    private final OrderRepository orderRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         FoodRepository foodRepository,
                         OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.foodRepository = foodRepository;
        this.orderRepository = orderRepository;
    }

    public Review addReview(User user, ReviewRequest request) {
        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundException("Food not found: " + request.getFoodId()));

        Review review = Review.builder()
                .foodId(food.getId())
                .foodName(food.getName())
                .orderId(request.getOrderId())
                .userId(user.getId())
                .userName(user.getName())
                .userRole(user.getRole())
                .rating(request.getRating())
                .waitTimeRating(request.getWaitTimeRating() > 0 ? request.getWaitTimeRating() : 5)
                .comment(request.getComment())
                .isApproved(true)
                .createdAt(Instant.now())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update Food average rating
        List<Review> reviews = reviewRepository.findByFoodIdAndIsApprovedTrueOrderByCreatedAtDesc(food.getId());
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(request.getRating());
        food.setRating(Math.round(avg * 10.0) / 10.0);
        food.setRatingCount(reviews.size());
        foodRepository.save(food);

        // If orderId is linked, update order rating
        if (request.getOrderId() != null && !request.getOrderId().isBlank()) {
            orderRepository.findById(request.getOrderId()).ifPresent(ord -> {
                ord.setRating(request.getRating());
                ord.setReviewComment(request.getComment());
                orderRepository.save(ord);
            });
        }

        return savedReview;
    }

    public List<Review> getReviewsForFood(String foodId) {
        return reviewRepository.findByFoodIdAndIsApprovedTrueOrderByCreatedAtDesc(foodId);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findByOrderByCreatedAtDesc();
    }
}
