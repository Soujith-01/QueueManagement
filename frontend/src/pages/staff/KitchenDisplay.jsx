import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tv, RefreshCw, ArrowLeft, Maximize2, Minimize2, Flame, CheckCircle2, AlertCircle } from 'lucide-react';
import orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import KdsColumn from '../../components/staff/KdsColumn';
import { playLeaveNowSound, playReadySound } from '../../utils/soundAlerts';

export default function KitchenDisplay() {
  const { subscribe, isConnected } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load KDS orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time updates via WebSocket
  useEffect(() => {
    if (!isConnected) return;

    const unsubStaff = subscribe('/topic/staff/orders', (incomingOrder) => {
      console.log('KDS Incoming order update:', incomingOrder);
      setOrders((prev) => {
        const index = prev.findIndex((o) => o.id === incomingOrder.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = incomingOrder;
          return updated;
        }
        playLeaveNowSound(); // Sound alert for new order
        return [incomingOrder, ...prev];
      });
    });

    return () => unsubStaff();
  }, [isConnected, subscribe]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      if (newStatus === 'READY') {
        playReadySound();
      }
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => console.log(e));
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch((e) => console.log(e));
      setIsFullScreen(false);
    }
  };

  const newOrders = orders.filter((o) => o.status === 'PLACED' || o.status === 'PAYMENT_CONFIRMED');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 flex flex-col">
      {/* KDS Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/staff"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-orange-400" />
            <h1 className="text-xl md:text-2xl font-display font-black text-white">
              Kitchen Display System (KDS)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400 font-mono font-semibold">Live Cooking Sync</span>
          </div>

          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Toggle Full Screen"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Refresh KDS"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* Column 1: New / Placed */}
        <KdsColumn
          title="New Orders"
          count={newOrders.length}
          icon={AlertCircle}
          colorClass="bg-blue-950/40 text-blue-300 border-blue-500/20"
          orders={newOrders}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* Column 2: Preparing */}
        <KdsColumn
          title="In Kitchen Cooking"
          count={preparingOrders.length}
          icon={Flame}
          colorClass="bg-amber-950/40 text-amber-300 border-amber-500/20"
          orders={preparingOrders}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* Column 3: Ready for Pickup */}
        <KdsColumn
          title="Ready at Counter 2"
          count={readyOrders.length}
          icon={CheckCircle2}
          colorClass="bg-emerald-950/40 text-emerald-300 border-emerald-500/20"
          orders={readyOrders}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
