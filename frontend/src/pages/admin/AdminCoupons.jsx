import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Plus, Edit, Trash2, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import adminService from '../../services/adminService';
import CouponModal from '../../components/admin/CouponModal';
import { formatCurrency } from '../../utils/formatters';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllCoupons();
      setCoupons(res.data || []);
    } catch (err) {
      console.error('Failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo coupon?')) return;
    try {
      await adminService.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert('Failed to delete coupon');
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
            <h1 className="text-2xl font-display font-black text-white">Promotions & Coupons</h1>
            <p className="text-xs text-slate-400">Create student meal discounts and festival promo codes</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedCoupon(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-500">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-500">No coupons active.</div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <span className="font-mono text-lg font-black text-orange-400 tracking-wider">
                    {coupon.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    coupon.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {coupon.isActive ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                </div>

                <div className="py-3 space-y-1 text-xs text-slate-300">
                  <div>Discount: <strong className="text-white">{coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}</strong></div>
                  <div>Min Order: <strong>₹{coupon.minimumOrder}</strong></div>
                  <div>Max Cap: <strong>₹{coupon.maximumDiscount}</strong></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedCoupon(coupon);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        couponToEdit={selectedCoupon}
        onSaved={fetchCoupons}
      />
    </div>
  );
}
