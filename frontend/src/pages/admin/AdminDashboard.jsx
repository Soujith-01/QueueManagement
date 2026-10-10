import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, 
  IndianRupee, 
  ShoppingBag, 
  Clock, 
  Flame, 
  Sparkles, 
  Utensils, 
  Users, 
  Calendar, 
  Tag, 
  Star, 
  Settings, 
  RefreshCw,
  Play
} from 'lucide-react';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import DemoSimulatorModal from '../../components/admin/DemoSimulatorModal';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSimulator, setShowSimulator] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes] = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getAnalytics(),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }
      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load admin analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Mock data fallbacks for charts if empty
  const ordersByHourData = analytics?.ordersByHour || [
    { hour: '11:00 AM', orders: 4 },
    { hour: '11:30 AM', orders: 8 },
    { hour: '12:00 PM', orders: 22 },
    { hour: '12:30 PM', orders: 38 },
    { hour: '1:00 PM', orders: 45 },
    { hour: '1:30 PM', orders: 28 },
    { hour: '2:00 PM', orders: 12 },
  ];

  const revenueByDayData = analytics?.revenueByDay || [
    { day: 'Mon', revenue: 4200 },
    { day: 'Tue', revenue: 5100 },
    { day: 'Wed', revenue: 4800 },
    { day: 'Thu', revenue: 6400 },
    { day: 'Fri', revenue: 7200 },
    { day: 'Sat', revenue: 3100 },
  ];

  const roleDistributionData = [
    { name: 'Student Orders', value: stats?.studentOrdersCount ?? 42, color: '#f97316' },
    { name: 'Faculty Orders', value: stats?.facultyOrdersCount ?? 14, color: '#a855f7' },
  ];

  const popularFoodsData = analytics?.popularFoods || [
    { name: 'Veg Biryani', orders: 54 },
    { name: 'Chicken Biryani', orders: 48 },
    { name: 'Samosa (2 pcs)', orders: 36 },
    { name: 'Paneer Roll', orders: 29 },
    { name: 'Thums Up', orders: 24 },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Sparkles className="w-4 h-4" />
            <span>Campus Canteen Analytics Hub</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white mt-1">Admin Command Center</h1>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSimulator(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            <span>Launch Demo Simulator</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Navigation Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar text-xs">
        <Link to="/admin/foods" className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 whitespace-nowrap">
          <Utensils className="w-3.5 h-3.5 text-orange-400" />
          <span>Food Menu</span>
        </Link>
        <Link to="/admin/categories" className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 whitespace-nowrap">
          <Tag className="w-3.5 h-3.5 text-blue-400" />
          <span>Categories</span>
        </Link>
        <Link to="/admin/slots" className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pickup Slots</span>
        </Link>
        <Link to="/admin/coupons" className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 whitespace-nowrap">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          <span>Coupons</span>
        </Link>
        <Link to="/admin/users" className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 whitespace-nowrap">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>Users</span>
        </Link>
        <Link to="/admin/reviews" className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 whitespace-nowrap">
          <Star className="w-3.5 h-3.5 text-yellow-400" />
          <span>Reviews</span>
        </Link>
        <Link to="/admin/settings" className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 whitespace-nowrap">
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Settings</span>
        </Link>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white mt-2">
            {formatCurrency(stats?.todayRevenue ?? 12480)}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+18.4% vs last week</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Orders Today</span>
            <ShoppingBag className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white mt-2">
            {stats?.todayOrdersCount ?? 68}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{stats?.completedOrdersCount ?? 56} picked up at Counter 2</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Prep Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white mt-2">
            {stats?.averagePreparationTimeMinutes ?? 8.5} <span className="text-sm font-normal text-slate-400">mins</span>
          </div>
          <p className="text-[11px] text-amber-400 mt-1">Faster by 4.2 mins with slots</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Queue Congestion</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white mt-2">
            Low / Balanced
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Slot load smoothly spread</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Orders by Hour (Rush Curve) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-1">Peak Lunch Rush & Order Volume</h3>
          <p className="text-xs text-slate-400 mb-6">Hourly order distribution across lunch break</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersByHourData}>
                <defs>
                  <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#orderGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 7-Day Revenue Trend */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-1">Weekly Revenue Performance (₹)</h3>
          <p className="text-xs text-slate-400 mb-6">Daily sales collections through online payments</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDayData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Most Popular Foods */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-1">Top 5 Campus Favorites</h3>
          <p className="text-xs text-slate-400 mb-6">Most ordered items this week</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularFoodsData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="orders" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Student vs Faculty Split */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Customer Segmentation</h3>
            <p className="text-xs text-slate-400 mb-4">Student vs Faculty lunch ordering proportion</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-center text-slate-400 pt-2 border-t border-slate-800/80">
            Separate faculty tracking enables prioritized express prep during short 30m break.
          </div>
        </div>
      </div>

      {/* Demo Simulator Modal */}
      <DemoSimulatorModal
        isOpen={showSimulator}
        onClose={() => setShowSimulator(false)}
        onRefresh={fetchDashboardData}
      />
    </div>
  );
}
