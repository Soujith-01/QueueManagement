import React, { useState, useEffect } from 'react';
import { X, Clock, Users } from 'lucide-react';
import adminService from '../../services/adminService';

export default function SlotModal({ isOpen, onClose, slotToEdit, onSaved }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '12:30',
    endTime: '12:40',
    capacity: 25,
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slotToEdit) {
      setFormData({
        date: slotToEdit.date || new Date().toISOString().split('T')[0],
        startTime: slotToEdit.startTime || '12:30',
        endTime: slotToEdit.endTime || '12:40',
        capacity: slotToEdit.capacity || 25,
        isAvailable: slotToEdit.isAvailable ?? true,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        startTime: '12:30',
        endTime: '12:40',
        capacity: 25,
        isAvailable: true,
      });
    }
  }, [slotToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
      };

      if (slotToEdit) {
        await adminService.updateSlot(slotToEdit.id, payload);
      } else {
        await adminService.createSlot(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save pickup slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-display font-bold text-white">
            {slotToEdit ? 'Edit Pickup Slot' : 'Add Pickup Slot'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-950/50 border border-rose-500/30 text-rose-300 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Time *</label>
              <input
                type="text"
                required
                placeholder="12:30 PM"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Time *</label>
              <input
                type="text"
                required
                placeholder="12:40 PM"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Max Order Capacity *</label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="number"
                required
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 rounded text-orange-500 focus:ring-0 bg-slate-950 border-slate-800"
              />
              <span className="text-sm font-medium text-slate-300">Slot Active & Bookable</span>
            </label>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold shadow-lg shadow-orange-500/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : slotToEdit ? 'Update Slot' : 'Create Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
