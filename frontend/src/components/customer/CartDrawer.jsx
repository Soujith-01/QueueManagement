import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { PickupSlotSelector } from './PickupSlotSelector';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';

export const CartDrawer = () => {
  const {
    items,
    totalItems,
    subtotal,
    discountAmount,
    tax,
    finalTotal,
    selectedSlot,
    couponCode,
    couponMessage,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [inputCoupon, setInputCoupon] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(inputCoupon.trim());
    setApplyingCoupon(false);
  };

  const handleCheckout = async () => {
    setCheckoutError('');

    if (!isAuthenticated) {
      setIsDrawerOpen(false);
      navigate('/login?redirect=/menu');
      return;
    }

    if (items.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setIsCheckingOut(true);

    try {
      // 1. Create order on backend
      const orderPayload = {
        items: items.map((i) => ({
          foodId: i.foodId,
          quantity: i.quantity,
        })),
        pickupSlotId: selectedSlot?.id || null,
        couponCode: couponCode || null,
        notes: orderNotes.trim() || null,
      };

      const createdOrder = await orderService.createOrder(orderPayload);

      // 2. Create Razorpay payment order
      const paymentOrderData = await paymentService.createPaymentOrder(createdOrder.id);

      // 3. Initiate checkout (Razorpay Modal / Demo Simulator)
      paymentService.initiateRazorpayCheckout({
        paymentData: paymentOrderData,
        order: createdOrder,
        user,
        onSuccess: (verifyResult) => {
          clearCart();
          setIsDrawerOpen(false);
          setIsCheckingOut(false);
          navigate(`/order/${createdOrder.id}`, { state: { justPlaced: true } });
        },
        onFailure: (err) => {
          setIsCheckingOut(false);
          setCheckoutError(err.message || 'Payment could not be completed.');
        },
      });
    } catch (err) {
      setIsCheckingOut(false);
      setCheckoutError(err.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0B0F19] border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Your Pre-Order Cart</h3>
                <p className="text-xs text-slate-400">{totalItems} {totalItems === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-white text-base">Your Cart is Empty</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse delicious meals, snacks, and beverages from today's canteen menu.
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.foodId}
                      className="p-3 rounded-xl bg-[#131B2E] border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-900 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          <h5 className="font-semibold text-xs text-white truncate">{item.name}</h5>
                        </div>
                        <p className="text-xs font-bold text-orange-400">
                          {formatCurrency(item.price)} <span className="text-[10px] text-slate-500 font-normal">each</span>
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.foodId)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pickup Slot Selector */}
                <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
                  <PickupSlotSelector />
                </div>

                {/* Coupon Code Section */}
                <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Tag className="w-4 h-4 text-orange-400" />
                    <span>Apply Coupon / Promo Code</span>
                  </div>

                  {couponCode ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-bold">{couponCode}</span> applied! Saved {formatCurrency(discountAmount)}
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-slate-400 hover:text-rose-400 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try CANTEEN10 or WELCOME20"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 uppercase font-mono"
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon || !inputCoupon.trim()}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-orange-500 hover:text-white text-xs font-bold text-slate-300 transition"
                      >
                        {applyingCoupon ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}

                  {couponMessage && !couponCode && (
                    <p className="text-[11px] text-rose-400">{couponMessage}</p>
                  )}
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Special Cooking Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Less spicy, extra sauce, pack separately"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Bill & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#101726] space-y-3">
              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Campus Canteen Convenience</span>
                  <span className="text-emerald-400">FREE ₹0</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Final Amount</span>
                  <span className="font-display text-lg text-orange-400">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {checkoutError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white hover:brightness-110 active:scale-[0.99] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Initializing Razorpay...
                  </>
                ) : !isAuthenticated ? (
                  <>
                    Login to Place Order <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Pay {formatCurrency(finalTotal)} with Razorpay <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Secure Razorpay Checkout • Instant QR Token</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
