import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Search, CheckCircle2, AlertTriangle, User, Clock, ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { formatCurrency, formatTime, getStatusBadgeClass } from '../../utils/formatters';
import { playReadySound } from '../../utils/soundAlerts';

export default function StaffScan() {
  const [scannedCode, setScannedCode] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize html5-qrcode camera scanner if available
    let html5QrcodeScanner = null;
    try {
      html5QrcodeScanner = new Html5QrcodeScanner(
        'qr-reader-container',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      html5QrcodeScanner.render(
        (decodedText) => {
          console.log('QR Code scanned:', decodedText);
          setScannedCode(decodedText);
          handleVerifyQr(decodedText);
        },
        (error) => {
          // Ignore frequent frame scan errors
        }
      );
      setCameraActive(true);
    } catch (e) {
      console.warn('Camera scanner initialization failed or camera not permitted', e);
      setCameraActive(false);
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch((e) => console.log(e));
      }
    };
  }, []);

  const handleVerifyQr = async (qrString) => {
    const raw = (qrString || '').trim();
    if (!raw) return;

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');
      setOrder(null);

      let cleanInput = raw;
      if (raw.includes('?qr=')) {
        cleanInput = raw.split('?qr=')[1].split('&')[0];
      } else if (raw.includes('?token=')) {
        cleanInput = raw.split('?token=')[1].split('&')[0];
      }

      let res;
      if (cleanInput.toUpperCase().startsWith('SQC-')) {
        res = await orderService.lookupByQr(cleanInput);
      } else if (/^[A-Za-z]\d{3,4}$/.test(cleanInput.trim())) {
        res = await orderService.lookupByToken(cleanInput);
      } else {
        try {
          res = await orderService.lookupByQr(cleanInput);
        } catch {
          res = await orderService.lookupByToken(cleanInput);
        }
      }

      const verifiedOrder = res.data?.order || res.data || res;
      setOrder(verifiedOrder);
      playReadySound();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleVerifyQr(manualInput.trim());
    }
  };

  const handleCompletePickup = async () => {
    if (!order) return;

    try {
      setLoading(true);
      let res;
      if (order.qrCodeIdentifier) {
        res = await orderService.verifyQrCode(order.qrCodeIdentifier);
      } else {
        res = await orderService.verifyToken(order.tokenNumber);
      }
      const updated = res.data || res;
      setOrder(updated);
      setSuccessMsg(`Order #${updated.tokenNumber} successfully handed over!`);
      playReadySound();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete order pickup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/staff"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-black text-white">Scan Customer QR</h1>
            <p className="text-xs text-slate-400">Quick Pickup Counter 2 Verification</p>
          </div>
        </div>
      </div>

      {/* Manual Input Fallback & Search */}
      <div className="mt-6 p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Manual Token / QR Identifier Search
        </label>
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. A014 or QR-A014-9982"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            Verify
          </button>
        </form>
      </div>

      {/* Camera QR Scanner Box */}
      <div className="mt-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-center gap-2">
          <QrCode className="w-4 h-4 text-orange-400" />
          <span>Camera Scanner</span>
        </h3>
        <div id="qr-reader-container" className="overflow-hidden rounded-2xl max-w-sm mx-auto bg-slate-950 border border-slate-800" />
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Verified Order Card */}
      {order && (
        <div className="mt-6 p-6 rounded-3xl bg-slate-900/90 border border-orange-500/40 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-black text-orange-400 bg-orange-500/10 px-3 py-1 rounded-xl border border-orange-500/20">
                #{order.token}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Paid</span>
              <div className="text-lg font-bold text-white font-mono">{formatCurrency(order.finalAmount || order.totalAmount)}</div>
            </div>
          </div>

          {/* Customer info */}
          <div className="py-3 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>Customer: <strong>{order.user?.name}</strong></span>
              {order.user?.role && (
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-bold text-slate-300">
                  {order.user.role}
                </span>
              )}
            </div>
            {order.pickupSlot && (
              <span className="text-amber-400 font-medium">
                Slot: {order.pickupSlot.startTime} - {order.pickupSlot.endTime}
              </span>
            )}
          </div>

          {/* Items */}
          <div className="py-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ordered Items:</span>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                    {item.quantity}x
                  </span>
                  <span className="font-medium text-white">{item.food?.name}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{formatCurrency(item.subtotal || item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            {order.status === 'COLLECTED' ? (
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2.5 rounded-2xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Order Already Collected & Closed</span>
              </div>
            ) : (
              <button
                onClick={handleCompletePickup}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Handover & Mark Collected</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
