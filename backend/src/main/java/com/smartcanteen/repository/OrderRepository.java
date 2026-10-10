package com.smartcanteen.repository;

import com.smartcanteen.model.Order;
import com.smartcanteen.model.OrderStatus;
import com.smartcanteen.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByQrCodeIdentifier(String qrCodeIdentifier);
    Optional<Order> findByTokenNumberAndPickupSlotDate(String tokenNumber, String pickupSlotDate);
    
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Order> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);
    List<Order> findByPickupSlotDateAndStatusIn(String date, List<OrderStatus> statuses);
    List<Order> findByPickupSlotIdAndStatusIn(String pickupSlotId, List<OrderStatus> statuses);
    
    long countByStatus(OrderStatus status);
    long countByPickupSlotDate(String date);
    long countByUserRole(Role role);
    long countByCreatedAtBetween(Instant start, Instant end);

    @Query("{ 'status': { $in: ['ACCEPTED', 'PREPARING'] } }")
    List<Order> findActiveKitchenOrders();

    @Query("{ 'status': { $in: ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED', 'PREPARING'] } }")
    List<Order> findActiveQueueOrders();
}
