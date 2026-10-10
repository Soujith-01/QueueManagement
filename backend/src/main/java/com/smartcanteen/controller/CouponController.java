package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.dto.CouponApplyDTO;
import com.smartcanteen.dto.CouponRequest;
import com.smartcanteen.model.Coupon;
import com.smartcanteen.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@Tag(name = "Coupons", description = "Coupon validation, discounts, and promo code management")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping("/active")
    @Operation(summary = "Get list of all active coupons for checkout promo banner")
    public ResponseEntity<ApiResponse<List<Coupon>>> getActiveCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getActiveCoupons(), "Active coupons retrieved"));
    }

    @PostMapping("/apply")
    @Operation(summary = "Validate and calculate discount for a coupon code")
    public ResponseEntity<ApiResponse<CouponApplyDTO.Response>> applyCoupon(@Valid @RequestBody CouponApplyDTO.Request request) {
        CouponApplyDTO.Response response = couponService.validateAndCalculateDiscount(request.getCode(), request.getSubtotal());
        return ResponseEntity.ok(ApiResponse.success(response, response.getMessage()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get all coupons (Admin only)")
    public ResponseEntity<ApiResponse<List<Coupon>>> getAllCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAllCoupons(), "All coupons retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Create a new coupon (Admin only)")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@Valid @RequestBody CouponRequest request) {
        Coupon coupon = couponService.createCoupon(request);
        return ResponseEntity.ok(ApiResponse.success(coupon, "Coupon created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update an existing coupon (Admin only)")
    public ResponseEntity<ApiResponse<Coupon>> updateCoupon(
            @PathVariable String id,
            @RequestBody CouponRequest request) {
        Coupon coupon = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(ApiResponse.success(coupon, "Coupon updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete coupon (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Coupon deleted successfully"));
    }
}
