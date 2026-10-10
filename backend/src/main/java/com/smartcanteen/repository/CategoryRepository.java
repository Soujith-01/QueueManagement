package com.smartcanteen.repository;

import com.smartcanteen.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByActiveTrueOrderByDisplayOrderAsc();
    Optional<Category> findByName(String name);
    Optional<Category> findBySlug(String slug);
}
