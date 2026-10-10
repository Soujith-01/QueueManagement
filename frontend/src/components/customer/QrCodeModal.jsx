import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, CheckCircle, Shield, Download } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const QrCodeModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify-order?qr=${encodeURIComponent(order.qrCodeIdentifier || order.id)}`
    : `https://canteen.smartqueueless.internal/verify-order?qr=${order.qrCodeIdentifier || order.id}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#131B2E] border border-slate-700 shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5" /> Quick Pickup Counter 2
          </span>
          <h3 className="font-display font-black text-2xl text-white">
            TOKEN: <span className="text-orange-400 font-mono">{order.tokenNumber}</span>
          </h3>
          <p className="text-xs text-slate-400">Scan this QR Code to retrieve full order details</p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 rounded-2xl bg-white mx-auto inline-block shadow-xl shadow-black/40">
          <QRCodeSVG
            value={qrUrl}
            size={190}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Quick Action to Test Scan Link */}
        <div className="pt-1">
          <a
            href={`/verify-order?qr=${encodeURIComponent(order.qrCodeIdentifier || order.id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-semibold border border-orange-500/30 transition"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Simulate Scan & View Order Details ↗</span>
          </a>
        </div>

        {/* Order Details Summary */}
        <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-left text-xs space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Order No:</span>
            <span className="text-white font-mono">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Pickup Slot:</span>
            <span className="text-orange-400 font-semibold">{order.pickupSlotTime || 'Standard'}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Paid Amount:</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(order.finalAmount)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted single-use verification token</span>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;
