import React from 'react';
import { Clock, User, CheckCircle2, XCircle, Flame, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { formatCurrency, formatTime, getStatusBadgeClass } from '../../utils/formatters';

export default function OrderKdsCard({ order, onUpdateStatus, compact = false }) {
  const isPaid = order.payment?.status === 'SUCCESS' || order.status !== 'PLACED';

  const getNextAction = (status) => {
    switch (status) {
      case 'PLACED':
      case 'PAYMENT_CONFIRMED':
        return {
          label: 'Start Preparing',
          nextStatus: 'PREPARING',
          icon: Flame,
          color: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
        };
      case 'PREPARING':
        return {
          label: 'Mark Ready',
          nextStatus: 'READY',
          icon: CheckCircle2,
          color: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
        };
      case 'READY':
        return {
          label: 'Handover & Complete',
          nextStatus: 'COLLECTED',
          icon: Check,
          color: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
        };
      default:
        return null;
    }
  };

  const action = getNextAction(order.status);

  return (
    <div className={`rounded-2xl border transition-all duration-200 ${
      order.status === 'READY'
        ? 'bg-emerald-950/20 border-emerald-500/30 shadow-lg shadow-emerald-950/30'
        : order.status === 'PREPARING'
        ? 'bg-amber-950/20 border-amber-500/30 shadow-lg shadow-amber-950/20'
        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
    } p-4 flex flex-col justify-between gap-3 backdrop-blur-md`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-black tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
              #{order.token || '---'}
            </span>
            {order.user?.role && (
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                order.user.role === 'FACULTY' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {order.user.role}
              </span>
            )}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Customer & Slot Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5">
          <div className="flex items-center gap-1 font-medium text-slate-300">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{order.user?.name || 'Customer'}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            <span>Slot: {order.pickupSlot ? `${order.pickupSlot.startTime}-${order.pickupSlot.endTime}` : 'Direct'}</span>
          </div>
        </div>

        {/* Items list */}
        <div className="mt-3 space-y-1.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                  {item.quantity}x
                </span>
                <span className="font-medium text-slate-200">{item.food?.name || 'Food Item'}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {formatCurrency(item.subtotal || item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="text-xs text-slate-400">
          <span>Ordered: <strong className="text-slate-200">{formatTime(order.createdAt)}</strong></span>
          <div className="font-semibold text-slate-100 mt-0.5">{formatCurrency(order.finalAmount || order.totalAmount)}</div>
        </div>

        <div className="flex items-center gap-1.5">
          {(order.status === 'PLACED' || order.status === 'PAYMENT_CONFIRMED') && (
            <button
              onClick={() => onUpdateStatus(order.id, 'REJECTED')}
              title="Reject Order"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}

          {action && (
            <button
              onClick={() => onUpdateStatus(order.id, action.nextStatus)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 ${action.color}`}
            >
              <action.icon className="w-3.5 h-3.5" />
              <span>{action.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
