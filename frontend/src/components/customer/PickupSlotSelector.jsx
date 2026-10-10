import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useCart } from '../../context/CartContext';

export const PickupSlotSelector = () => {
  const { selectedSlot, setSelectedSlot } = useCart();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlots = async () => {
      try {
        const res = await orderService.getPickupSlots();
        if (res) {
          setSlots(res);
          // Default select the first available slot if not selected
          if (!selectedSlot) {
            const firstAvailable = res.find((s) => s.isAvailable && s.currentOrders < s.capacity);
            if (firstAvailable) {
              setSelectedSlot(firstAvailable);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load slots:', e);
      } finally {
        setLoading(false);
      }
    };
    loadSlots();
  }, []);

  if (loading) {
    return (
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-2">
        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 bg-slate-800 rounded-xl"></div>
          <div className="h-16 bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-400" />
          <h4 className="text-sm font-bold text-white">Select Pickup Time Slot</h4>
        </div>
        <span className="text-[11px] text-slate-400">10-Min intervals</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
        {slots.map((slot, index) => {
          const isSelected = selectedSlot?.id === slot.id;
          const isFull = !slot.isAvailable || slot.currentOrders >= slot.capacity;
          const remaining = Math.max(0, slot.capacity - slot.currentOrders);
          const percentUsed = Math.round((slot.currentOrders / slot.capacity) * 100);
          const isRecommended = index === 0 || (index === 1 && slots[0].currentOrders > 15);

          return (
            <button
              key={slot.id || index}
              type="button"
              disabled={isFull}
              onClick={() => setSelectedSlot(slot)}
              className={`p-3 rounded-xl text-left border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isFull
                  ? 'bg-slate-900/40 border-slate-800/60 text-slate-500 cursor-not-allowed opacity-60'
                  : isSelected
                  ? 'bg-orange-500/15 border-orange-500 text-white shadow-lg shadow-orange-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {isRecommended && !isFull && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-2.5 h-2.5" /> Fast
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-semibold text-xs tracking-tight">
                  {slot.label || `${slot.startTime} - ${slot.endTime}`}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />}
              </div>

              {/* Capacity Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  {isFull ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Slot Full
                    </span>
                  ) : (
                    <span className="text-slate-400">{remaining} slots left</span>
                  )}
                  <span className="text-slate-500">{slot.currentOrders}/{slot.capacity}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull
                        ? 'bg-rose-500'
                        : percentUsed > 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, percentUsed)}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PickupSlotSelector;
