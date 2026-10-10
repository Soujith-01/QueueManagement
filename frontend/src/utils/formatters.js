export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatTime = (isoString) => {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return isoString;
  }
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return isoString;
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'PLACED':
    case 'PAYMENT_CONFIRMED':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case 'ACCEPTED':
      return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
    case 'PREPARING':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse';
    case 'READY':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse';
    case 'COLLECTED':
    case 'COMPLETED':
      return 'bg-teal-500/20 text-teal-300 border border-teal-500/30';
    case 'CANCELLED':
    case 'REJECTED':
      return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    case 'REFUNDED':
      return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    default:
      return 'bg-slate-800 text-slate-400 border border-slate-700';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'PLACED':
      return 'Order Placed';
    case 'PAYMENT_CONFIRMED':
      return 'Payment Confirmed';
    case 'ACCEPTED':
      return 'Accepted by Kitchen';
    case 'PREPARING':
      return 'Cooking in Kitchen';
    case 'READY':
      return 'Ready for Pickup';
    case 'COLLECTED':
      return 'Order Collected';
    case 'CANCELLED':
      return 'Cancelled';
    case 'REJECTED':
      return 'Rejected';
    case 'REFUNDED':
      return 'Refunded';
    default:
      return status;
  }
};
