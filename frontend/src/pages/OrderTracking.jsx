import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  QrCode, 
  ArrowLeft, 
  CheckCircle2, 
  Flame, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  ShoppingBag, 
  Star,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import orderService from '../services/orderService';
import queueService from '../services/queueService';
import OrderTrackerCard from '../components/customer/OrderTrackerCard';
import LeaveNowBanner from '../components/customer/LeaveNowBanner';
import QrCodeModal from '../components/customer/QrCodeModal';
import ReviewModal from '../components/customer/ReviewModal';
import { formatCurrency, formatTime } from '../utils/formatters';
import { playReadySound, playLeaveNowSound } from '../utils/soundAlerts';

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribe, isConnected } = useSocket();

  const [order, setOrder] = useState(null);
  const [queueEstimate, setQueueEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Fetch order data
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      let currentOrder = null;

      if (id) {
        const res = await orderService.getOrderById(id);
        currentOrder = res.data?.order || res.order || res.data || res;
      } else {
        const activeRes = await orderService.getActiveOrders();
        const activeOrders = activeRes.data || activeRes || [];
        if (activeOrders.length > 0) {
          currentOrder = activeOrders[0];
        }
      }

      if (currentOrder && currentOrder.id) {
        setOrder(currentOrder);
        // Fetch queue status for this order
        try {
          const qRes = await queueService.getOrderQueueStatus(currentOrder.id);
          setQueueEstimate(qRes.data || qRes);
        } catch (e) {
          console.warn('Queue estimate not available yet', e);
        }
      } else {
        setError('No active order found.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Subscribe to real-time order updates via WebSocket
  useEffect(() => {
    if (!order?.id || !isConnected) return;

    const unsubOrder = subscribe(`/topic/orders/${order.id}`, (updatedOrder) => {
      console.log('Real-time order update received:', updatedOrder);
      setOrder((prev) => {
        if (updatedOrder.status === 'READY' && prev?.status !== 'READY') {
          playReadySound();
        }
        return { ...prev, ...updatedOrder };
      });
    });

    const unsubQueue = subscribe('/topic/queue', (queueData) => {
      console.log('Real-time queue update:', queueData);
      setQueueEstimate((prev) => ({
        ...prev,
        activeOrdersInQueue: queueData.activeOrdersInQueue,
        estimatedWaitTimeMinutes: queueData.estimatedWaitTimeMinutes,
      }));
    });

    return () => {
      unsubOrder();
      unsubQueue();
    };
  }, [order?.id, isConnected, subscribe]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? An automatic refund will be processed.')) {
      return;
    }

    try {
      setCancelling(true);
      await orderService.cancelOrder(order.id, 'Customer cancelled before preparation');
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-300 font-medium">Fetching your live kitchen status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">No Active Order</h2>
          <p className="text-sm text-slate-400 mb-6">{error || 'You do not have any pending orders right now.'}</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/menu"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20"
            >
              Order Food Now
            </Link>
            <Link
              to="/orders"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm"
            >
              Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCancellable = order.status === 'PLACED' || order.status === 'PAYMENT_CONFIRMED';
  const isReady = order.status === 'READY';
  const isCollected = order.status === 'COLLECTED';

  return (
    <div className="min-h-screen pb-24 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono font-medium text-emerald-400">Live STOMP Connected</span>
        </div>
      </div>

      {/* Leave Now Smart Banner */}
      <div className="mt-4">
        <LeaveNowBanner order={order} />
      </div>

      {/* Main Order Tracker Card */}
      <div className="mt-4">
        <OrderTrackerCard
          order={order}
          queueEstimate={queueEstimate}
          onViewQr={() => setShowQrModal(true)}
        />
      </div>

      {/* Pickup Location & Counter Directions */}
      <div className="mt-6 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white">Pickup Instructions</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Head to <strong className="text-orange-400">Counter 2 (Smart QueueLess Quick Pickup)</strong> in the central canteen. 
            Do NOT join the cash/ordering line. Present your digital QR code to staff.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {isCancellable && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order (Full Refund)'}
          </button>
        )}

        {isCollected && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>Rate This Meal</span>
          </button>
        )}

        <button
          onClick={fetchOrder}
          className="ml-auto p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Modals */}
      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        order={order}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        order={order}
        onReviewed={() => {
          setShowReviewModal(false);
          fetchOrder();
        }}
      />
    </div>
  );
}
