import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  QrCode, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import foodService from '../services/foodService';
import queueService from '../services/queueService';
import aiService from '../services/aiService';
import FoodCard from '../components/customer/FoodCard';
import { formatCurrency } from '../utils/formatters';

export default function Home() {
  const { user, isCustomer, isCanteenAdmin, isSuperAdmin, switchDemoRole } = useAuth();
  const [popularFoods, setPopularFoods] = useState([]);
  const [queueStatus, setQueueStatus] = useState(null);
  const [crowdPrediction, setCrowdPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [foodsRes, queueRes, aiRes] = await Promise.allSettled([
          foodService.getAllFoods(),
          queueService.getCurrentQueueStatus(),
          aiService.getCrowdPrediction(),
        ]);

        if (foodsRes.status === 'fulfilled') {
          const foods = foodsRes.value.data || [];
          // Get top 4 rated / available items
          setPopularFoods(foods.filter(f => f.isAvailable).slice(0, 4));
        }

        if (queueRes.status === 'fulfilled') {
          setQueueStatus(queueRes.value.data);
        }

        if (aiRes.status === 'fulfilled') {
          setCrowdPrediction(aiRes.value.data);
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Live Queue Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs sm:text-sm font-semibold mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>Smart QueueLess Live: Quick Pickup Counter 2 Active</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white leading-tight">
              Skip the Queue. <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Enjoy Your Lunch Break.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Pre-order your favorite campus meals, book a 10-minute pickup slot, pay online, and grab your tray instantly with a quick QR scan.
            </p>

            {/* Hero CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {isCanteenAdmin ? (
                <>
                  <Link
                    to="/canteen-admin"
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 group"
                  >
                    <span>Canteen Operations & Products</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/staff/kitchen"
                    className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/80 backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
                  >
                    <ChefHat className="w-5 h-5 text-amber-400" />
                    <span>Kitchen KDS Display</span>
                  </Link>
                </>
              ) : isSuperAdmin ? (
                <>
                  <Link
                    to="/admin"
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-bold text-base shadow-xl shadow-rose-500/25 active:scale-95 transition-all flex items-center gap-2 group"
                  >
                    <span>Super Admin Directorate</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/admin/users"
                    className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/80 backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Users className="w-5 h-5 text-rose-400" />
                    <span>User Management</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/menu"
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2 group"
                  >
                    <span>Order Lunch Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {user ? (
                    <Link
                      to="/orders"
                      className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/80 backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Clock className="w-5 h-5 text-orange-400" />
                      <span>My Active Orders</span>
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/80 backdrop-blur-md active:scale-95 transition-all"
                    >
                      <span>Customer Signup</span>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Quick 3-Role Demo Showcase */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Experience by Role:</span>
              <button
                onClick={() => switchDemoRole('CUSTOMER')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isCustomer
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 font-bold shadow-md shadow-orange-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <span>🎓 Customer</span>
              </button>
              <button
                onClick={() => switchDemoRole('CANTEEN_ADMIN')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isCanteenAdmin
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <span>🍳 Canteen Admin</span>
              </button>
              <button
                onClick={() => switchDemoRole('SUPER_ADMIN')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isSuperAdmin
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold shadow-md shadow-rose-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <span>🛡️ Super Admin</span>
              </button>
            </div>
          </div>

          {/* Real-time Status Card & AI Predictions */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Live Queue Box */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-orange-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Kitchen Queue</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-display font-black text-white">
                  {queueStatus?.activeOrdersInQueue ?? 6}
                </span>
                <span className="text-sm font-medium text-slate-400">orders preparing</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span>Avg Wait: <strong className="text-amber-400">{queueStatus?.estimatedWaitTimeMinutes ?? 8} mins</strong></span>
                <span className="text-emerald-400 font-medium">Counter 2: No Line</span>
              </div>
            </div>

            {/* AI Crowd Peak Predictor */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-950/40 via-slate-900/70 to-slate-900/70 border border-orange-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-orange-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Rush Forecast</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {crowdPrediction?.crowdLevel || 'PEAK RUSH'}
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-200">
                <p className="font-semibold text-white">
                  {crowdPrediction?.predictionMessage || 'High crowd expected between 12:45 PM and 1:15 PM.'}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Recommended:</span>
                <span className="font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                  {crowdPrediction?.recommendedPickupSlot || '12:30–12:40 PM'}
                </span>
              </div>
            </div>

            {/* Quick Pickup Guarantee */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pickup Counter #2</span>
                <QrCode className="w-5 h-5 text-amber-400" />
              </div>
              <div className="mt-3">
                <h4 className="text-base font-bold text-white">Instant QR Verification</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Food is packaged and ready before you arrive. Show token QR code to staff and walk away in 15 seconds.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Physical Line Wait Time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Steps Section */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-400">How It Works</h2>
            <p className="text-3xl font-display font-bold text-white mt-1">3 Simple Steps to Zero Queue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 flex flex-col items-start hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-display font-black text-xl flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Select Food & Pickup Slot</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Browse today's live stock, add items to cart, and choose your preferred 10-minute pickup window during break.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 flex flex-col items-start hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-display font-black text-xl flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Pay Online & Get Token</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Seamless digital payment via Razorpay. Get your daily token number (e.g. #A014) and secure QR code instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 flex flex-col items-start hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-display font-black text-xl flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Leave Now & Quick Collect</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Receive the "Leave Now" ping when cooking is almost done. Walk up to Counter 2, scan QR, and take your hot meal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Popular Items Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
              <Flame className="w-4 h-4" />
              <span>Campus Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">Today's Popular Menu</h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {popularFoods.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>Loading hot campus menu items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-slate-900/30 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
                <Zap className="w-3.5 h-3.5" />
                <span>Smart Campus Life</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                Designed for Fast-Paced College Break Schedules
              </h2>
              <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
                Whether you're a student rushing between lab sessions or a faculty member with a 30-minute lunch window, QueueLess ensures you get hot, freshly made food without the frustration of crowded counters.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white text-sm">Guaranteed Food Availability:</strong>
                    <p className="text-xs text-slate-400">Pre-ordering locks your favorite Biryani or Samosa so you never face "Sold Out" after walking to the canteen.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white text-sm">Real-time WebSocket Tracking:</strong>
                    <p className="text-xs text-slate-400">See your exact queue position (e.g. 3 orders ahead) update live on your phone without refreshing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white text-sm">Separate Student & Faculty Analytics:</strong>
                    <p className="text-xs text-slate-400">Canteen staff optimize kitchen prep based on department demand patterns and lunch bell timings.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Card / Mock Preview */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-300">LIVE TOKEN: #A014</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  FOOD READY
                </span>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Pickup at Counter 2</p>
                <div className="text-3xl font-display font-black text-white mt-1">Hyderabadi Veg Biryani</div>
                <div className="mt-4 inline-block p-4 bg-white rounded-2xl shadow-lg">
                  <QrCode className="w-32 h-32 text-slate-950 mx-auto" />
                </div>
                <p className="mt-4 text-xs font-mono text-slate-400">Slot: 12:40 PM - 12:50 PM • Paid ₹80</p>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs text-center font-semibold">
                🔔 "Your food is ready for pickup! Proceed to Counter 2"
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
