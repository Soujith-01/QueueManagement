import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Edit, Trash2, ArrowLeft, RefreshCw, Users, Clock } from 'lucide-react';
import adminService from '../../services/adminService';
import SlotModal from '../../components/admin/SlotModal';

export default function AdminSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllSlots();
      setSlots(res.data || []);
    } catch (err) {
      console.error('Failed to load slots', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Delete this pickup slot?')) return;
    try {
      await adminService.deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete slot');
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-black text-white">Pickup Time Slots</h1>
            <p className="text-xs text-slate-400">Configure 10-minute pickup windows and capacity caps</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedSlot(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pickup Slot</span>
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-500">Loading pickup slots...</div>
        ) : slots.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-500">No pickup slots configured.</div>
        ) : (
          slots.map((slot) => {
            const isFull = slot.currentOrders >= slot.capacity;
            return (
              <div
                key={slot.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isFull
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 text-white font-display font-bold text-base">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isFull ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {isFull ? 'FULL' : 'OPEN'}
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Capacity</span>
                  <span className="font-mono font-bold text-white">{slot.currentOrders || 0} / {slot.capacity} orders</span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${isFull ? 'bg-rose-500' : 'bg-orange-500'}`}
                    style={{ width: `${Math.min(100, ((slot.currentOrders || 0) / slot.capacity) * 100)}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedSlot(slot);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <SlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slotToEdit={selectedSlot}
        onSaved={fetchSlots}
      />
    </div>
  );
}
