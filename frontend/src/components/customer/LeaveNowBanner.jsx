import React from 'react';
import { Navigation, Clock, Sparkles } from 'lucide-react';

export const LeaveNowBanner = ({ tokenNumber, estimatedMinutes = 5, order }) => {
  const token = tokenNumber || order?.token || '---';
  const minutes = estimatedMinutes || order?.estimatedMinutes || 5;

  // Only display if order is PREPARING or token exists
  if (order && order.status !== 'PREPARING') {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-4 text-white shadow-xl shadow-orange-600/20 border border-orange-400/40 animate-bounce-subtle">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
          <Navigation className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-white text-orange-600 tracking-wider">
              LEAVE NOW ALERT
            </span>
            <span className="text-xs font-bold text-orange-100 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> ~{minutes} mins remaining
            </span>
          </div>
          <h4 className="font-display font-extrabold text-sm sm:text-base leading-tight">
            Order #{token} is nearly ready!
          </h4>
          <p className="text-xs text-orange-100/90 line-clamp-1">
            Head to Canteen Quick Pickup Counter 2 now to collect your meal hot & fresh.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaveNowBanner;
