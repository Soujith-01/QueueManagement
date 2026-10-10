import React from 'react';
import OrderKdsCard from './OrderKdsCard';

export default function KdsColumn({ title, count, icon: Icon, colorClass, orders = [], onUpdateStatus }) {
  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-3xl border border-slate-800/80 backdrop-blur-md overflow-hidden shadow-xl">
      {/* Column Header */}
      <div className={`p-4 border-b border-slate-800 flex items-center justify-between ${colorClass}`}>
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-5 h-5" />}
          <h3 className="font-display font-bold text-lg text-white tracking-wide">{title}</h3>
        </div>
        <span className="w-7 h-7 rounded-full bg-white/10 font-mono font-black text-sm flex items-center justify-center text-white border border-white/20">
          {count}
        </span>
      </div>

      {/* Orders Container */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
        {orders.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-sm italic">
            <span>No orders in this stage</span>
          </div>
        ) : (
          orders.map((order) => (
            <OrderKdsCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
