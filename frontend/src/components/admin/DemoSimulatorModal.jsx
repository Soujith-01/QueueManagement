import React, { useState } from 'react';
import { Play, Sparkles, X, RefreshCw, Flame, CheckCircle, PlusCircle, AlertTriangle } from 'lucide-react';
import adminService from '../../services/adminService';
import orderService from '../../services/orderService';
import foodService from '../../services/foodService';

export default function DemoSimulatorModal({ isOpen, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);

  if (!isOpen) return null;

  const handleSimulateOrder = async () => {
    try {
      setLoading(true);
      setResultMsg(null);
      // Fetch available foods
      const foodsRes = await foodService.getAllFoods();
      const availableFoods = (foodsRes.data || []).filter(f => f.isAvailable && f.stock > 0);

      if (availableFoods.length === 0) {
        setResultMsg({ type: 'error', text: 'No available food items to order!' });
        return;
      }

      // Select 1 or 2 random foods
      const randomFood1 = availableFoods[Math.floor(Math.random() * availableFoods.length)];
      const items = [{ foodId: randomFood1.id, quantity: Math.floor(Math.random() * 2) + 1 }];

      // Create order
      const orderRes = await orderService.createOrder({
        items,
        pickupSlotId: null, // Asap/direct
        paymentMethod: 'RAZORPAY_TEST',
        couponCode: null,
      });

      setResultMsg({
        type: 'success',
        text: `Simulated order created! Token: #${orderRes.data?.token || 'NEW'} (Total: ₹${orderRes.data?.finalAmount})`
      });

      if (onRefresh) onRefresh();
    } catch (err) {
      setResultMsg({ type: 'error', text: err.response?.data?.message || 'Failed to simulate order' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceFirstOrder = async () => {
    try {
      setLoading(true);
      setResultMsg(null);
      const ordersRes = await orderService.getAllOrders();
      const orders = ordersRes.data || [];
      
      const preparing = orders.find(o => o.status === 'PREPARING');
      const placed = orders.find(o => o.status === 'PLACED' || o.status === 'PAYMENT_CONFIRMED');

      if (preparing) {
        await orderService.updateOrderStatus(preparing.id, 'READY');
        setResultMsg({ type: 'success', text: `Order #${preparing.token} moved from PREPARING to READY!` });
      } else if (placed) {
        await orderService.updateOrderStatus(placed.id, 'PREPARING');
        setResultMsg({ type: 'success', text: `Order #${placed.token} moved from PLACED to PREPARING!` });
      } else {
        setResultMsg({ type: 'info', text: 'No active orders in queue to advance.' });
      }

      if (onRefresh) onRefresh();
    } catch (err) {
      setResultMsg({ type: 'error', text: err.response?.data?.message || 'Failed to advance order' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-display font-bold text-white">Live Presentation Simulator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-400 mt-3">
          Simulate canteen activity instantly during hackathon/college project demos without opening multiple devices.
        </p>

        {resultMsg && (
          <div className={`mt-4 p-3.5 rounded-2xl border text-sm flex items-center gap-2 ${
            resultMsg.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' :
            resultMsg.type === 'error' ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' :
            'bg-blue-950/40 border-blue-500/30 text-blue-300'
          }`}>
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{resultMsg.text}</span>
          </div>
        )}

        <div className="mt-5 space-y-3">
          <button
            onClick={handleSimulateOrder}
            disabled={loading}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold flex items-center justify-between shadow-lg shadow-orange-500/20 active:scale-98 transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="text-sm font-bold">Simulate Instant Student Order</div>
                <div className="text-xs text-orange-100 font-normal">Places random food order & assigns daily token</div>
              </div>
            </div>
            <Play className="w-4 h-4" />
          </button>

          <button
            onClick={handleAdvanceFirstOrder}
            disabled={loading}
            className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold flex items-center justify-between active:scale-98 transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <div className="text-sm font-bold">Advance Kitchen Order Stage</div>
                <div className="text-xs text-slate-400 font-normal">Moves order: Placed → Preparing → Ready</div>
              </div>
            </div>
            <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
