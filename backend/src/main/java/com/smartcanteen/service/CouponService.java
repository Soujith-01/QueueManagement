package com.smartcanteen.service;

import com.smartcanteen.dto.CouponApplyDTO;
import com.smartcanteen.dto.CouponRequest;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.model.Coupon;
import com.smartcanteen.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByActiveTrue();
    }

    public CouponApplyDTO.Response validateAndCalculateDiscount(String code, double subtotal) {
        if (code == null || code.isBlank()) {
            return CouponApplyDTO.Response.builder()
                    .valid(false)
                    .message("Coupon code is required")
                    .build();
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim()).orElse(null);
        if (coupon == null || !coupon.isActive()) {
            return CouponApplyDTO.Response.builder()
                    .valid(false)
                    .code(code)
                    .discountAmount(0)
                    .finalSubtotal(subtotal)
                    .message("Invalid or inactive coupon code.")
                    .build();
        }

        if (subtotal < coupon.getMinimumOrder()) {
            return CouponApplyDTO.Response.builder()
                    .valid(false)
                    .code(coupon.getCode())
                    .discountAmount(0)
                    .finalSubtotal(subtotal)
                    .message("Minimum order value for this coupon is ₹" + (int) coupon.getMinimumOrder())
                    .build();
        }

        double discount = coupon.calculateDiscount(subtotal);
        return CouponApplyDTO.Response.builder()
                .valid(true)
                .code(coupon.getCode())
                .discountAmount(discount)
                .finalSubtotal(Math.max(0, subtotal - discount))
                .message("Coupon applied successfully! You saved ₹" + (int) discount)
                .build();
    }

    public double applyCoupon(String code, double subtotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim()).orElse(null);
        if (coupon != null && coupon.isValid(subtotal)) {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
            return coupon.calculateDiscount(subtotal);
        }
        return 0.0;
    }

    public Coupon createCoupon(CouponRequest request) {
        if (couponRepository.findByCodeIgnoreCase(request.getCode().trim()).isPresent()) {
            throw new BadRequestException("Coupon code already exists: " + request.getCode());
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode().toUpperCase().trim())
                .description(request.getDescription())
                .discountType(request.getDiscountType().toUpperCase())
                .discountValue(request.getDiscountValue())
                .minimumOrder(request.getMinimumOrder())
                .maximumDiscount(request.getMaximumDiscount())
                .expiryDate(request.getExpiryDate())
                .usageLimit(request.getUsageLimit() != null ? request.getUsageLimit() : 1000)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(String id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new com.smartcanteen.exception.ResourceNotFoundException("Coupon not found with id: " + id));

        if (request.getCode() != null && !request.getCode().isBlank()) {
            coupon.setCode(request.getCode().toUpperCase().trim());
        }
        if (request.getDescription() != null) coupon.setDescription(request.getDescription());
        if (request.getDiscountType() != null) coupon.setDiscountType(request.getDiscountType().toUpperCase());
        if (request.getDiscountValue() > 0) coupon.setDiscountValue(request.getDiscountValue());
        if (request.getMinimumOrder() >= 0) coupon.setMinimumOrder(request.getMinimumOrder());
        if (request.getMaximumDiscount() >= 0) coupon.setMaximumDiscount(request.getMaximumDiscount());
        if (request.getExpiryDate() != null) coupon.setExpiryDate(request.getExpiryDate());
        if (request.getUsageLimit() != null) coupon.setUsageLimit(request.getUsageLimit());
        if (request.getActive() != null) coupon.setActive(request.getActive());

        return couponRepository.save(coupon);
    }

    public void deleteCoupon(String id) {
        couponRepository.deleteById(id);
    }
}
