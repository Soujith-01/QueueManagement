import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, QrCode, ArrowRight, RefreshCw, Star, Repeat, ShoppingBag, AlertCircle } from 'lucide-react';
import orderService from '../services/orderService';
import { useCart } from '../context/CartContext';
import QrCodeModal from '../components/customer/QrCodeModal';
import ReviewModal from '../components/customer/ReviewModal';
import { formatCurrency, formatTime, getStatusBadgeClass } from '../utils/formatters';

export default function OrderHistory() {
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQrOrder, setSelectedQrOrder] = useState(null);
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await orderService.getUserOrders();
      setOrders(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = async (order) => {
    // Add items from this order into current cart
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        if (item.food) {
          addItem(item.food, item.quantity);
        }
      });
      openCart();
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Clock className="w-4 h-4" />
            <span>My Meal Orders</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white mt-1">Order History</h1>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          title="Refresh orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 p-6 rounded-3xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-center text-sm">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Orders Yet</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            You haven't placed any canteen pre-orders yet. Pre-order now to skip the queue!
          </p>
          <Link
            to="/menu"
            className="mt-5 inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20"
          >
            Browse Today's Menu
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const isActive = !['COLLECTED', 'CANCELLED', 'REJECTED'].includes(order.status);
            return (
              <div
                key={order.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isActive
                    ? 'bg-slate-900/90 border-orange-500/40 shadow-lg shadow-orange-500/5'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-lg font-black text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-lg border border-orange-500/20">
                      #{order.token || '---'}
                    </span>
                    <span className="text-xs text-slate-400">{formatTime(order.createdAt)}</span>
                  </div>

                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items preview */}
                <div className="py-3 text-sm text-slate-300">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="text-xs font-medium text-slate-200">
                        {item.quantity}x {item.food?.name || 'Food'}
                      </span>
                    ))}
                  </div>
                  {order.pickupSlot && (
                    <div className="mt-2 text-xs text-amber-400/90 font-medium">
                      Pickup Window: {order.pickupSlot.startTime} - {order.pickupSlot.endTime}
                    </div>
                  )}
                </div>

                {/* Footer and Actions */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="text-xs text-slate-500">Paid Amount: </span>
                    <span className="font-bold text-white">{formatCurrency(order.finalAmount || order.totalAmount)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <>
                        <button
                          onClick={() => setSelectedQrOrder(order)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5 text-orange-400" />
                          <span>QR Code</span>
                        </button>

                        <button
                          onClick={() => navigate(`/order/${order.id}`)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <span>Track Live</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Repeat className="w-3.5 h-3.5 text-amber-400" />
                          <span>Reorder</span>
                        </button>

                        {order.status === 'COLLECTED' && (
                          <button
                            onClick={() => setSelectedReviewOrder(order)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <QrCodeModal
        isOpen={!!selectedQrOrder}
        onClose={() => setSelectedQrOrder(null)}
        order={selectedQrOrder}
      />

      <ReviewModal
        isOpen={!!selectedReviewOrder}
        onClose={() => setSelectedReviewOrder(null)}
        order={selectedReviewOrder}
        onReviewed={() => {
          setSelectedReviewOrder(null);
          fetchOrders();
        }}
      />
    </div>
  );
}
