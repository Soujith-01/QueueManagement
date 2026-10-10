package com.smartcanteen.repository;

import com.smartcanteen.model.PickupSlot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupSlotRepository extends MongoRepository<PickupSlot, String> {
    List<PickupSlot> findByDateOrderByStartTimeAsc(String date);
    Optional<PickupSlot> findByDateAndStartTime(String date, String startTime);
    List<PickupSlot> findByDateAndIsAvailableTrue(String date);
}
