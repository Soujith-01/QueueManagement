import React, { useState } from 'react';
import {
  QrCode,
  Clock,
  CheckCircle,
  Users,
  Navigation,
  Star,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { STATUS_CONFIG, ORDER_STATUS } from '../../utils/constants';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { QrCodeModal } from './QrCodeModal';
import { LeaveNowBanner } from './LeaveNowBanner';
import { ReviewModal } from './ReviewModal';

export const OrderTrackerCard = ({ order, liveQueuePosition = 0, shouldLeaveNow = false, onRefresh }) => {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  if (!order) return null;

  const currentStatus = order.status || ORDER_STATUS.PLACED;
  const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.PLACED;
  const isReady = currentStatus === ORDER_STATUS.READY;
  const isPreparing = currentStatus === ORDER_STATUS.PREPARING;
  const isCollected = currentStatus === ORDER_STATUS.COLLECTED || currentStatus === ORDER_STATUS.COMPLETED;

  const steps = [
    { key: 'PLACED', label: 'Placed' },
    { key: 'PAYMENT_CONFIRMED', label: 'Paid' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'PREPARING', label: 'Preparing' },
    { key: 'READY', label: 'Ready' },
    { key: 'COLLECTED', label: 'Collected' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="rounded-3xl bg-[#131B2E] border border-slate-800 shadow-2xl overflow-hidden">
      {/* Leave Now banner if applicable */}
      {(shouldLeaveNow || isPreparing) && (
        <div className="p-4 bg-orange-500/10 border-b border-orange-500/20">
          <LeaveNowBanner
            tokenNumber={order.tokenNumber}
            estimatedMinutes={liveQueuePosition > 0 ? liveQueuePosition * 2 + 3 : 5}
          />
        </div>
      )}

      {/* Main Order Card Body */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Token and Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-0.5">DAILY TOKEN NUMBER</span>
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-4xl sm:text-5xl text-orange-400 tracking-tight font-mono">
                {order.tokenNumber}
              </span>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusConfig.color}`}>
                <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
                {statusConfig.label}
              </div>
            </div>
          </div>

          {/* Quick QR Code Trigger */}
          <button
            onClick={() => setIsQrOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-orange-500/15 border border-orange-500/40 text-orange-400 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold shadow-md shadow-orange-500/10 self-start sm:self-center"
          >
            <QrCode className="w-4 h-4" /> View Pickup QR
          </button>
        </div>

        {/* Live Queue & Waiting Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span>Orders Ahead</span>
            </div>
            <p className="font-display font-black text-2xl text-white">
              {isReady || isCollected ? '0' : Math.max(0, liveQueuePosition - 1)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pickup Slot</span>
            </div>
            <p className="font-semibold text-xs sm:text-sm text-emerald-400 truncate">
              {order.pickupSlotTime || 'Standard Queue'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Estimated Ready</span>
            </div>
            <p className="font-semibold text-xs sm:text-sm text-white">
              {isReady ? 'Ready for Pickup!' : formatTime(order.estimatedReadyTime)}
            </p>
          </div>
        </div>

        {/* Visual Progress Steps Timeline */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-400">Preparation Pipeline</span>
          <div className="grid grid-cols-6 gap-1 sm:gap-2">
            {steps.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step.key} className="flex flex-col items-center text-center gap-1.5">
                  <div
                    className={`w-full h-2 rounded-full transition-all duration-300 ${
                      isPassed
                        ? isReady && step.key === 'READY'
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-orange-500'
                        : 'bg-slate-800'
                    }`}
                  />
                  <span
                    className={`text-[10px] truncate max-w-full font-medium ${
                      isCurrent
                        ? 'text-orange-400 font-bold'
                        : isPassed
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ordered Food Items Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800">
            <span>Ordered Items</span>
            <span>Total: {formatCurrency(order.finalAmount)}</span>
          </div>

          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span className="text-white font-medium">{item.foodName}</span>
                  <span className="text-slate-500">× {item.quantity}</span>
                </div>
                <span className="text-slate-300">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collected / Review action */}
        {isCollected && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Meal Collected & Completed</span>
            </div>
            <button
              onClick={() => setIsReviewOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:brightness-110 flex items-center gap-1 shadow-md"
            >
              <Star className="w-3.5 h-3.5 fill-white" /> Rate Meal
            </button>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <QrCodeModal
        order={order}
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        order={order}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onReviewSubmitted={onRefresh}
      />
    </div>
  );
};

export default OrderTrackerCard;
