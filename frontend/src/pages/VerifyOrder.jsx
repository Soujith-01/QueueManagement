import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  CheckCircle2, 
  Clock, 
  User, 
  ShoppingBag, 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  RefreshCw, 
  MapPin, 
  ShieldCheck, 
  ChefHat, 
  Search,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatTime, getStatusBadgeClass } from '../utils/formatters';
import { playReadySound } from '../utils/soundAlerts';

export default function VerifyOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { user, isCanteenAdmin, isSuperAdmin } = useAuth();

  const qrParam = searchParams.get('qr') || '';
  const tokenParam = searchParams.get('token') || '';
  const idParam = searchParams.get('id') || routeId || '';

  const [searchInput, setSearchInput] = useState(qrParam || tokenParam || idParam || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch order details based on QR identifier, token, or order ID
  const fetchOrderDetails = async (query) => {
    const raw = (query || searchInput || '').trim();
    if (!raw) return;

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      let res;

      // Extract raw code if query is a full URL
      let cleanQuery = raw;
      if (raw.includes('?qr=')) {
        cleanQuery = raw.split('?qr=')[1].split('&')[0];
      } else if (raw.includes('?token=')) {
        cleanQuery = raw.split('?token=')[1].split('&')[0];
      } else if (raw.includes('/order/')) {
        cleanQuery = raw.split('/order/')[1].split('?')[0];
      }

      if (cleanQuery.toUpperCase().startsWith('SQC-')) {
        res = await orderService.lookupByQr(cleanQuery);
      } else if (/^[A-Za-z]\d{3,4}$/.test(cleanQuery.trim())) {
        res = await orderService.lookupByToken(cleanQuery);
      } else if (cleanQuery.length === 24 || cleanQuery.startsWith('ORD-')) {
        res = await orderService.getOrderById(cleanQuery);
      } else {
        // Fallback: try lookupByQr first, then by token
        try {
          res = await orderService.lookupByQr(cleanQuery);
        } catch {
          res = await orderService.lookupByToken(cleanQuery);
        }
      }

      const orderData = res.data?.order || res.data || res;
      if (orderData && orderData.id) {
        setOrder(orderData);
      } else {
        setError('No matching order found for this QR code or token.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please verify the QR code or token.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = qrParam || tokenParam || idParam;
    if (initialQuery) {
      setSearchInput(initialQuery);
      fetchOrderDetails(initialQuery);
    }
  }, [qrParam, tokenParam, idParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      if (searchInput.toUpperCase().startsWith('SQC-')) {
        setSearchParams({ qr: searchInput.trim() });
      } else {
        setSearchParams({ token: searchInput.trim() });
      }
      fetchOrderDetails(searchInput);
    }
  };

  // Staff/Canteen Admin Handover Action
  const handleMarkCollected = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      setError('');
      
      let res;
      if (order.qrCodeIdentifier) {
        res = await orderService.verifyQrCode(order.qrCodeIdentifier);
      } else {
        res = await orderService.verifyToken(order.tokenNumber);
      }

      const updated = res.data || res;
      setOrder(updated);
      setSuccessMessage(`Order #${updated.tokenNumber} marked as COLLECTED! Meal handed over.`);
      playReadySound();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete order handover.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCollected = order?.status === 'COLLECTED' || order?.status === 'COMPLETED';
  const isReady = order?.status === 'READY';
  const isPreparing = order?.status === 'PREPARING';
  const canHandover = isCanteenAdmin || isSuperAdmin || user?.role === 'STAFF' || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-6 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-medium text-emerald-400">Live QR Verification Active</span>
        </div>
      </div>

      {/* Search & Lookup Bar */}
      <div className="mt-6 p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
          <QrCode className="w-4 h-4" />
          <span>Live Token & QR Lookup</span>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Scan or enter Token (e.g. A001) or QR (e.g. SQC-3132DF...)"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-orange-500 uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Lookup'}
          </button>
        </form>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mt-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-xs text-emerald-400 hover:text-white underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="mt-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
          <p className="text-slate-400 font-medium">Fetching complete order details from QR code...</p>
        </div>
      )}

      {/* ORDER DETAILS SCREEN */}
      {order && !loading && (
        <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          {/* Main Verification Hero Header */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#131B2E] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  OFFICIAL CANTEEN PICKUP PASS
                </span>
                <div className="flex items-center gap-4">
                  <h2 className="font-display font-black text-4xl sm:text-6xl text-orange-400 font-mono tracking-tight">
                    #{order.tokenNumber || '---'}
                  </h2>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${getStatusBadgeClass(order.status)}`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    <span>{order.status}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-2">
                  Order ID: <span className="text-slate-200">{order.orderNumber}</span>
                </p>
              </div>

              {/* Status Action Badge */}
              <div className="text-right sm:self-center">
                <span className="text-xs font-semibold text-slate-400 block mb-1">PICKUP LOCATION</span>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Counter 2 (Quick Pickup)</span>
                </div>
              </div>
            </div>

            {/* Customer & Time Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Customer Details</span>
                </div>
                <p className="font-bold text-white text-sm truncate">{order.userName || 'Student'}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{order.userEmail || order.userPhone || 'Verified Account'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Scheduled Pickup Slot</span>
                </div>
                <p className="font-bold text-emerald-400 text-sm">{order.pickupSlotTime || 'Standard Queue'}</p>
                <p className="text-[11px] text-slate-400 font-mono">Date: {order.pickupSlotDate || 'Today'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payment Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{formatCurrency(order.finalAmount)}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">PAID</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Online Pre-Payment</p>
              </div>
            </div>
          </div>

          {/* ITEM BREAKDOWN */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <h3 className="font-display font-bold text-base text-white">Food Items in this Order</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0)} items total
              </span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <div>
                      <p className="font-bold text-white text-sm">
                        {item.foodName || item.name || item.food?.name || 'Canteen Item'}
                      </p>
                      <span className="text-xs text-slate-400 font-mono">
                        {formatCurrency(item.price || item.unitPrice || 0)} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-lg bg-slate-950 text-orange-400 font-mono font-bold text-sm border border-slate-800">
                      × {item.quantity}
                    </span>
                    <span className="font-mono font-bold text-white text-sm w-16 text-right">
                      {formatCurrency(item.subtotal || (item.price * item.quantity))}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Bill Summary */}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-slate-200 font-mono">{formatCurrency(order.subtotal || order.finalAmount)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
                  <span className="font-mono">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-slate-800/60">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-400 font-mono text-base">{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* HANDOVER ACTIONS */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-400" />
                <h4 className="font-bold text-white text-sm">Counter Handover & Verification</h4>
              </div>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share QR Link'}</span>
              </button>
            </div>

            {isCollected ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-sm text-white">Meal Already Handed Over</h5>
                  <p className="text-xs text-slate-300 mt-0.5">
                    This order token has been verified and food delivered to the customer.
                  </p>
                </div>
              </div>
            ) : canHandover ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Verify the food items on the tray against the list above. Then tap below to mark this order delivered.
                </p>
                <button
                  onClick={handleMarkCollected}
                  disabled={actionLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm Food Handover & Mark Order Collected</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Present this screen or your token QR code to the staff at Counter 2.</span>
                <Link
                  to={`/order/${order.id}`}
                  className="px-3 py-1.5 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white font-bold transition"
                >
                  View Live Queue Tracker →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
