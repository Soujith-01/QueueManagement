import React, { useState, useEffect } from 'react';
import { X, Tag, Calendar, Percent } from 'lucide-react';
import adminService from '../../services/adminService';

export default function CouponModal({ isOpen, onClose, couponToEdit, onSaved }) {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minimumOrder: 50,
    maximumDiscount: 50,
    usageLimit: 100,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (couponToEdit) {
      setFormData({
        code: couponToEdit.code || '',
        discountType: couponToEdit.discountType || 'PERCENTAGE',
        discountValue: couponToEdit.discountValue || 10,
        minimumOrder: couponToEdit.minimumOrder || 50,
        maximumDiscount: couponToEdit.maximumDiscount || 50,
        usageLimit: couponToEdit.usageLimit || 100,
        isActive: couponToEdit.isActive ?? true,
      });
    } else {
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minimumOrder: 50,
        maximumDiscount: 50,
        usageLimit: 100,
        isActive: true,
      });
    }
  }, [couponToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minimumOrder: parseFloat(formData.minimumOrder),
        maximumDiscount: parseFloat(formData.maximumDiscount),
        usageLimit: parseInt(formData.usageLimit, 10),
      };

      if (couponToEdit) {
        await adminService.updateCoupon(couponToEdit.id, payload);
      } else {
        await adminService.createCoupon(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-display font-bold text-white">
            {couponToEdit ? 'Edit Coupon' : 'Create New Coupon'}
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Coupon Code *</label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="CANTEEN10"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-orange-500 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Discount Value *</label>
              <input
                type="number"
                required
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Min Order (₹)</label>
              <input
                type="number"
                value={formData.minimumOrder}
                onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Max Discount (₹)</label>
              <input
                type="number"
                value={formData.maximumDiscount}
                onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-orange-500 focus:ring-0 bg-slate-950 border-slate-800"
              />
              <span className="text-sm font-medium text-slate-300">Active & Usable</span>
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
              {loading ? 'Saving...' : couponToEdit ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
