import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  CheckCircle2, 
  QrCode, 
  Package, 
  Tv, 
  RefreshCw, 
  Clock, 
  ShoppingBag, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import OrderKdsCard from '../../components/staff/OrderKdsCard';

export default function StaffDashboard() {
  const { subscribe, isConnected } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load staff orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Listen to live staff order events
  useEffect(() => {
    if (!isConnected) return;

    const unsubStaff = subscribe('/topic/staff/orders', (incomingOrder) => {
      setOrders((prev) => {
        const index = prev.findIndex((o) => o.id === incomingOrder.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = incomingOrder;
          return updated;
        }
        return [incomingOrder, ...prev];
      });
    });

    return () => unsubStaff();
  }, [isConnected, subscribe]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const newOrders = orders.filter((o) => o.status === 'PLACED' || o.status === 'PAYMENT_CONFIRMED');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');
  const completedOrders = orders.filter((o) => o.status === 'COLLECTED');

  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Flame className="w-4 h-4" />
            <span>Canteen Operations Central</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white mt-1">Staff Dashboard</h1>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          <Link
            to="/staff/kitchen"
            className="px-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition-all"
          >
            <Tv className="w-4 h-4" />
            <span>Full KDS Screen</span>
          </Link>

          <Link
            to="/staff/scan"
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR / Verify</span>
          </Link>

          <button
            onClick={fetchOrders}
            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>New Incoming</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-3xl font-display font-black text-white mt-2">{newOrders.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Needs kitchen acceptance</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-amber-400">
            <span>In Preparation</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-display font-black text-white mt-2">{preparingOrders.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Cooking in progress</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span>Ready for Pickup</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-display font-black text-white mt-2">{readyOrders.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Waiting at Counter 2</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Collected Today</span>
            <ShoppingBag className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-display font-black text-white mt-2">{completedOrders.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Successful handovers</p>
        </div>
      </div>

      {/* Active Orders List */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <span>Active Kitchen Pipeline</span>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              {newOrders.length + preparingOrders.length + readyOrders.length}
            </span>
          </h2>
          <Link
            to="/staff/kitchen"
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <span>Open Kanban View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : newOrders.length + preparingOrders.length + readyOrders.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">All Kitchen Orders Cleared!</h3>
            <p className="text-xs text-slate-400 mt-1">No pending food orders right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...newOrders, ...preparingOrders, ...readyOrders].map((order) => (
              <OrderKdsCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
