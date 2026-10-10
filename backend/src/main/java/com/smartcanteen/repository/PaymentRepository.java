package com.smartcanteen.repository;

import com.smartcanteen.model.Payment;
import com.smartcanteen.model.PaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByOrderId(String orderId);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    List<Payment> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Payment> findByStatus(PaymentStatus status);
}
