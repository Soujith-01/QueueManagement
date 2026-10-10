package com.smartcanteen.controller;

import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.dto.PickupSlotRequest;
import com.smartcanteen.model.PickupSlot;
import com.smartcanteen.service.PickupSlotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickup-slots")
@Tag(name = "Pickup Slots", description = "Time slot capacity management and booking")
public class PickupSlotController {

    private final PickupSlotService pickupSlotService;

    public PickupSlotController(PickupSlotService pickupSlotService) {
        this.pickupSlotService = pickupSlotService;
    }

    @GetMapping
    @Operation(summary = "Get pickup slots for a specific date (defaults to today)")
    public ResponseEntity<ApiResponse<List<PickupSlot>>> getSlots(@RequestParam(required = false) String date) {
        List<PickupSlot> slots = pickupSlotService.getSlotsForDate(date);
        return ResponseEntity.ok(ApiResponse.success(slots, "Pickup slots retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Create custom pickup time slot (Canteen Admin / Super Admin)")
    public ResponseEntity<ApiResponse<PickupSlot>> createSlot(@Valid @RequestBody PickupSlotRequest request) {
        PickupSlot created = pickupSlotService.createSlot(request);
        return ResponseEntity.ok(ApiResponse.success(created, "Pickup slot created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CANTEEN_ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMIN')")
    @Operation(summary = "Update pickup time slot (Canteen Admin / Super Admin)")
    public ResponseEntity<ApiResponse<PickupSlot>> updateSlot(
            @PathVariable String id,
            @Valid @RequestBody PickupSlotRequest request) {
        PickupSlot updated = pickupSlotService.updateSlot(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Pickup slot updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete pickup time slot (Super Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteSlot(@PathVariable String id) {
        pickupSlotService.deleteSlot(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Pickup slot deleted"));
    }
}
