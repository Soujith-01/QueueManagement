package com.smartcanteen.service;

import com.smartcanteen.dto.CouponApplyDTO;
import com.smartcanteen.model.Coupon;
import com.smartcanteen.repository.CouponRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private CouponService couponService;

    private Coupon campus20;
    private Coupon flat50;

    @BeforeEach
    void setUp() {
        campus20 = Coupon.builder()
                .code("CAMPUS20")
                .discountType("PERCENTAGE")
                .discountValue(20.0)
                .minimumOrder(100.0)
                .maximumDiscount(50.0)
                .active(true)
                .build();

        flat50 = Coupon.builder()
                .code("FLAT50")
                .discountType("FIXED")
                .discountValue(50.0)
                .minimumOrder(150.0)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Should apply percentage discount with max discount capping")
    void testApplyPercentageCouponWithCap() {
        when(couponRepository.findByCodeIgnoreCase("CAMPUS20")).thenReturn(Optional.of(campus20));

        // Subtotal 400 * 20% = 80, but capped at 50
        CouponApplyDTO.Response response = couponService.validateAndCalculateDiscount("CAMPUS20", 400.0);

        assertTrue(response.isValid());
        assertEquals(50.0, response.getDiscountAmount());
        assertEquals(350.0, response.getFinalSubtotal());
    }

    @Test
    @DisplayName("Should reject coupon when subtotal is below minimum order requirement")
    void testRejectCouponBelowMinimumOrder() {
        when(couponRepository.findByCodeIgnoreCase("CAMPUS20")).thenReturn(Optional.of(campus20));

        CouponApplyDTO.Response response = couponService.validateAndCalculateDiscount("CAMPUS20", 80.0);

        assertFalse(response.isValid());
        assertEquals(0.0, response.getDiscountAmount());
        assertTrue(response.getMessage().contains("Minimum order value"));
    }

    @Test
    @DisplayName("Should apply fixed amount discount")
    void testApplyFixedDiscount() {
        when(couponRepository.findByCodeIgnoreCase("FLAT50")).thenReturn(Optional.of(flat50));

        CouponApplyDTO.Response response = couponService.validateAndCalculateDiscount("FLAT50", 200.0);

        assertTrue(response.isValid());
        assertEquals(50.0, response.getDiscountAmount());
        assertEquals(150.0, response.getFinalSubtotal());
    }

    @Test
    @DisplayName("Should return invalid for non-existent coupon")
    void testInvalidCouponCode() {
        when(couponRepository.findByCodeIgnoreCase("NONEXISTENT")).thenReturn(Optional.empty());

        CouponApplyDTO.Response response = couponService.validateAndCalculateDiscount("NONEXISTENT", 200.0);

        assertFalse(response.isValid());
        assertEquals(0.0, response.getDiscountAmount());
    }
}
