package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.dto.CategoryRequest;
import com.smartcanteen.model.Category;
import com.smartcanteen.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Food Categories", description = "Category management and listing")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    @Operation(summary = "Get all active categories")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(
                categoryRepository.findByActiveTrueOrderByDisplayOrderAsc(),
                "Categories retrieved"
        ));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Create category (Canteen Admin / Super Admin)")
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody CategoryRequest request) {
        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");
        Category category = Category.builder()
                .name(request.getName().trim())
                .slug(slug)
                .icon(request.getIcon() != null ? request.getIcon() : "🍽️")
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.success(saved, "Category created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Update category (Canteen Admin / Super Admin)")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable String id,
            @RequestBody CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new com.smartcanteen.exception.ResourceNotFoundException("Category not found with id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            category.setName(request.getName().trim());
            category.setSlug(request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        }
        if (request.getIcon() != null) category.setIcon(request.getIcon());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) category.setDisplayOrder(request.getDisplayOrder());
        if (request.getActive() != null) category.setActive(request.getActive());

        Category updated = categoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.success(updated, "Category updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Delete category (Canteen Admin / Super Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted"));
    }
}
