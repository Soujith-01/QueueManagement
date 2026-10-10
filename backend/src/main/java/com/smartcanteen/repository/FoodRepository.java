package com.smartcanteen.repository;

import com.smartcanteen.model.Food;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends MongoRepository<Food, String> {
    List<Food> findByCategory(String category);
    List<Food> findByIsAvailableTrue();
    List<Food> findByIsVeg(boolean isVeg);
    List<Food> findByIsSpecialTodayTrue();
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Food> searchByName(String keyword);

    List<Food> findTop8ByOrderBySoldCountDesc();
}
