package com.smartcanteen.service;

import com.smartcanteen.dto.PickupSlotRequest;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.exception.SlotFullException;
import com.smartcanteen.model.PickupSlot;
import com.smartcanteen.repository.PickupSlotRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PickupSlotService {

    private static final Logger log = LoggerFactory.getLogger(PickupSlotService.class);

    private final PickupSlotRepository pickupSlotRepository;
    private final WebSocketNotificationService wsService;

    public PickupSlotService(PickupSlotRepository pickupSlotRepository, WebSocketNotificationService wsService) {
        this.pickupSlotRepository = pickupSlotRepository;
        this.wsService = wsService;
    }

    public List<PickupSlot> getSlotsForDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) {
            dateStr = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        }
        List<PickupSlot> slots = pickupSlotRepository.findByDateOrderByStartTimeAsc(dateStr);
        if (slots.isEmpty()) {
            slots = generateDefaultSlotsForDate(dateStr);
        }
        return slots;
    }

    public List<PickupSlot> generateDefaultSlotsForDate(String dateStr) {
        List<PickupSlot> slots = new ArrayList<>();
        LocalTime time = LocalTime.of(11, 30);
        LocalTime endTime = LocalTime.of(15, 30);

        while (time.isBefore(endTime)) {
            LocalTime next = time.plusMinutes(10);
            String startStr = time.format(DateTimeFormatter.ofPattern("HH:mm"));
            String endStr = next.format(DateTimeFormatter.ofPattern("HH:mm"));
            String label = time.format(DateTimeFormatter.ofPattern("hh:mm a")) + " - " +
                    next.format(DateTimeFormatter.ofPattern("hh:mm a"));

            PickupSlot slot = PickupSlot.builder()
                    .date(dateStr)
                    .startTime(startStr)
                    .endTime(endStr)
                    .label(label)
                    .capacity(25)
                    .currentOrders(0)
                    .isAvailable(true)
                    .build();

            slots.add(pickupSlotRepository.save(slot));
            time = next;
        }
        return slots;
    }

    public PickupSlot getSlotById(String id) {
        return pickupSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found: " + id));
    }

    public synchronized PickupSlot reserveSlot(String slotId) {
        if (slotId == null || slotId.isBlank()) {
            return null;
        }

        PickupSlot slot = getSlotById(slotId);
        if (!slot.isAvailable() || slot.isFull()) {
            Optional<PickupSlot> nextAvailable = findNextAvailableSlot(slot.getDate());
            String nextMsg = nextAvailable.map(s -> " Next recommended slot: " + s.getLabel()).orElse("");
            throw new SlotFullException("Pickup slot '" + slot.getLabel() + "' is fully booked." + nextMsg);
        }

        slot.setCurrentOrders(slot.getCurrentOrders() + 1);
        if (slot.isFull()) {
            slot.setAvailable(false);
        }

        PickupSlot saved = pickupSlotRepository.save(slot);
        wsService.notifyQueueUpdate(saved);
        return saved;
    }

    public synchronized void releaseSlot(String slotId) {
        if (slotId == null || slotId.isBlank()) return;
        pickupSlotRepository.findById(slotId).ifPresent(slot -> {
            slot.setCurrentOrders(Math.max(0, slot.getCurrentOrders() - 1));
            slot.setAvailable(true);
            pickupSlotRepository.save(slot);
        });
    }

    public Optional<PickupSlot> findNextAvailableSlot(String dateStr) {
        List<PickupSlot> slots = getSlotsForDate(dateStr);
        return slots.stream().filter(s -> s.isAvailable() && !s.isFull()).findFirst();
    }

    public PickupSlot createSlot(PickupSlotRequest request) {
        PickupSlot slot = PickupSlot.builder()
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .label(request.getLabel() != null ? request.getLabel() : request.getStartTime() + " - " + request.getEndTime())
                .capacity(request.getCapacity() > 0 ? request.getCapacity() : 25)
                .currentOrders(0)
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();

        return pickupSlotRepository.save(slot);
    }

    public PickupSlot updateSlot(String id, PickupSlotRequest request) {
        PickupSlot slot = getSlotById(id);
        if (request.getDate() != null) slot.setDate(request.getDate());
        if (request.getStartTime() != null) slot.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) slot.setEndTime(request.getEndTime());
        if (request.getLabel() != null) slot.setLabel(request.getLabel());
        if (request.getCapacity() > 0) slot.setCapacity(request.getCapacity());
        if (request.getIsAvailable() != null) slot.setAvailable(request.getIsAvailable());
        return pickupSlotRepository.save(slot);
    }

    public void deleteSlot(String id) {
        pickupSlotRepository.deleteById(id);
    }
}
