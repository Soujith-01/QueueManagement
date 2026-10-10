package com.smartcanteen.repository;

import com.smartcanteen.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByFoodIdAndIsApprovedTrueOrderByCreatedAtDesc(String foodId);
    List<Review> findByOrderByCreatedAtDesc();
    Optional<Review> findByOrderId(String orderId);
    List<Review> findByUserId(String userId);
}
