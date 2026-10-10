export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const WS_URL = import.meta.env.VITE_WS_URL || '/ws';
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_college_canteen_dummy_key';
export const CANTEEN_NAME = import.meta.env.VITE_CANTEEN_NAME || 'Apex University Central Canteen';

export const ORDER_STATUS = {
  PLACED: 'PLACED',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  COLLECTED: 'COLLECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
};

export const STATUS_CONFIG = {
  PLACED: {
    label: 'Order Placed',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    dotColor: 'bg-amber-500',
    step: 1,
  },
  PAYMENT_CONFIRMED: {
    label: 'Payment Verified',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    dotColor: 'bg-blue-500',
    step: 2,
  },
  ACCEPTED: {
    label: 'Accepted by Kitchen',
    color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    dotColor: 'bg-indigo-500',
    step: 3,
  },
  PREPARING: {
    label: 'Cooking / Preparing',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    dotColor: 'bg-orange-500 animate-pulse',
    step: 4,
  },
  READY: {
    label: 'Ready for Quick Pickup',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-950/50 shadow-lg',
    dotColor: 'bg-emerald-500 animate-ping',
    step: 5,
  },
  COLLECTED: {
    label: 'Collected / Delivered',
    color: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    dotColor: 'bg-teal-500',
    step: 6,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    dotColor: 'bg-slate-400',
    step: 6,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    dotColor: 'bg-rose-500',
    step: 0,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    dotColor: 'bg-red-500',
    step: 0,
  },
};

export const CROWD_COLORS = {
  LOW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  VERY_HIGH: 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse',
};
