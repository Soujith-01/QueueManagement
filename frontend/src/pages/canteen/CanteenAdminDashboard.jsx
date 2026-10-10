import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  UtensilsCrossed, 
  Package, 
  ChefHat, 
  QrCode, 
  Search, 
  Edit2, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Clock, 
  IndianRupee, 
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Filter
} from 'lucide-react';
import foodService from '../../services/foodService';
import orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import FoodModal from '../../components/admin/FoodModal';
import { formatCurrency, formatTime, getStatusBadgeClass } from '../../utils/formatters';
import { playReadySound } from '../../utils/soundAlerts';

export default function CanteenAdminDashboard() {
  const { subscribe, isConnected } = useSocket();

  const [activeTab, setActiveTab] = useState('products'); // 'products', 'inventory', 'kitchen', 'scanner'
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [vegFilter, setVegFilter] = useState('ALL'); // 'ALL', 'VEG', 'NON_VEG'

  // Food Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [foodsRes, categoriesRes, ordersRes] = await Promise.allSettled([
        foodService.getAllFoods(),
        foodService.getAllCategories(),
        orderService.getAllOrders(),
      ]);

      if (foodsRes.status === 'fulfilled') {
        setFoods(foodsRes.value.data || foodsRes.value || []);
      }
      if (categoriesRes.status === 'fulfilled') {
        setCategories(categoriesRes.value.data || categoriesRes.value || []);
      }
      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value.data || ordersRes.value || []);
      }
    } catch (err) {
      console.error('Failed to load canteen admin data', err);
      setError('Failed to load canteen data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Real-time STOMP subscriptions
  useEffect(() => {
    if (!isConnected) return;

    const unsubKitchen = subscribe('/topic/kitchen', (incomingOrder) => {
      console.log('Live kitchen update received in Canteen Admin:', incomingOrder);
      setOrders((prev) => {
        const exists = prev.some((o) => o.id === incomingOrder.id);
        if (exists) {
          return prev.map((o) => (o.id === incomingOrder.id ? incomingOrder : o));
        }
        return [incomingOrder, ...prev];
      });
      playReadySound();
    });

    const unsubInventory = subscribe('/topic/inventory', (updatedFood) => {
      setFoods((prev) => prev.map((f) => (f.id === updatedFood.id ? { ...f, ...updatedFood } : f)));
    });

    return () => {
      unsubKitchen();
      unsubInventory();
    };
  }, [isConnected, subscribe]);

  // Stock Adjustment
  const handleStockAdjust = async (food, delta) => {
    const newStock = Math.max(0, (food.stock || 0) + delta);
    try {
      setFoods((prev) => prev.map((f) => (f.id === food.id ? { ...f, stock: newStock } : f)));
      await foodService.updateStock(food.id, newStock);
    } catch (err) {
      console.error('Failed to update stock', err);
      fetchData();
    }
  };

  // Availability Toggle
  const handleToggleAvailability = async (food) => {
    try {
      setFoods((prev) =>
        prev.map((f) => (f.id === food.id ? { ...f, isAvailable: !f.isAvailable } : f))
      );
      await foodService.toggleAvailability(food.id);
    } catch (err) {
      console.error('Failed to toggle availability', err);
      fetchData();
    }
  };

  // Delete Food
  const handleDeleteFood = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item from the menu?')) {
      return;
    }
    try {
      await foodService.deleteFood(id);
      setFoods((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert('Failed to delete food item');
    }
  };

  // Order status advance
  const handleAdvanceOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      const updated = res.data || res;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      playReadySound();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Quick Pickup verification state
  const [qrInput, setQrInput] = useState('');
  const [qrVerifying, setQrVerifying] = useState(false);
  const [scannedOrderDetails, setScannedOrderDetails] = useState(null);
  const [qrResult, setQrResult] = useState(null);
  const [qrError, setQrError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Quick Pickup verification & lookup
  const handleVerifyQr = async (e, directInput) => {
    if (e && e.preventDefault) e.preventDefault();
    const raw = (directInput || qrInput || '').trim();
    if (!raw) return;

    try {
      setQrVerifying(true);
      setQrError('');
      setQrResult(null);

      let cleanInput = raw;
      if (raw.includes('?qr=')) {
        cleanInput = raw.split('?qr=')[1].split('&')[0];
      } else if (raw.includes('?token=')) {
        cleanInput = raw.split('?token=')[1].split('&')[0];
      } else if (raw.includes('/order/')) {
        cleanInput = raw.split('/order/')[1].split('?')[0];
      }

      let res;
      if (cleanInput.toUpperCase().startsWith('SQC-')) {
        res = await orderService.lookupByQr(cleanInput);
      } else if (/^[A-Za-z]\d{3,4}$/.test(cleanInput.trim())) {
        res = await orderService.lookupByToken(cleanInput);
      } else if (cleanInput.length === 24 || cleanInput.startsWith('ORD-')) {
        res = await orderService.getOrderById(cleanInput);
      } else {
        try {
          res = await orderService.lookupByQr(cleanInput);
        } catch {
          res = await orderService.lookupByToken(cleanInput);
        }
      }

      const orderData = res.data?.order || res.data || res;
      if (orderData && orderData.id) {
        setScannedOrderDetails(orderData);
        playReadySound();
      } else {
        setQrError('No matching order found for this QR code or token.');
      }
    } catch (err) {
      setQrError(err.response?.data?.message || err.message || 'Invalid QR code or token number');
      setScannedOrderDetails(null);
    } finally {
      setQrVerifying(false);
    }
  };

  const handleConfirmHandover = async (targetOrder) => {
    const ord = targetOrder || scannedOrderDetails;
    if (!ord) return;

    try {
      setActionLoading(true);
      setQrError('');

      let res;
      if (ord.qrCodeIdentifier) {
        res = await orderService.verifyQrCode(ord.qrCodeIdentifier);
      } else {
        res = await orderService.verifyToken(ord.tokenNumber);
      }

      const verifiedOrder = res.data || res;
      setQrResult(verifiedOrder);
      setScannedOrderDetails(verifiedOrder);
      playReadySound();
      fetchData();
    } catch (err) {
      setQrError(err.response?.data?.message || err.message || 'Failed to complete handover');
    } finally {
      setActionLoading(false);
    }
  };

  // Metrics
  const lowStockCount = useMemo(() => foods.filter((f) => (f.stock || 0) < 10).length, [foods]);
  const activeKitchenCount = useMemo(
    () => orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING').length,
    [orders]
  );
  const readyPickupCount = useMemo(
    () => orders.filter((o) => o.status === 'READY').length,
    [orders]
  );

  // Filtered foods
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      if (categoryFilter !== 'ALL' && f.category !== categoryFilter) return false;
      if (vegFilter === 'VEG' && !f.isVeg) return false;
      if (vegFilter === 'NON_VEG' && f.isVeg) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          f.name?.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q) ||
          f.category?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [foods, categoryFilter, vegFilter, search]);

  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Canteen Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <ChefHat className="w-4 h-4" />
            <span>Canteen Operations Management</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white mt-1">Canteen Admin Portal</h1>
          <p className="text-sm text-slate-400 mt-1">
            Add & manage food products, update live kitchen stocks, and handle quick student pickups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            title="Refresh All"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setFoodToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div 
          onClick={() => setActiveTab('products')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-slate-900 border-orange-500/50 shadow-lg shadow-orange-500/5'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu Products</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-black text-white mt-2">{foods.length}</div>
          <span className="text-xs text-orange-400 mt-1 block font-medium">Click to manage products & prices</span>
        </div>

        <div 
          onClick={() => setActiveTab('inventory')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              lowStockCount > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-black text-white mt-2">{lowStockCount}</div>
          <span className="text-xs text-slate-400 mt-1 block">Items below 10 portions remaining</span>
        </div>

        <div 
          onClick={() => setActiveTab('kitchen')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'kitchen'
              ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active in Kitchen</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-black text-white mt-2">{activeKitchenCount}</div>
          <span className="text-xs text-indigo-400 mt-1 block font-medium">Currently cooking / accepted</span>
        </div>

        <div 
          onClick={() => setActiveTab('scanner')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'scanner'
              ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready for Pickup</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-black text-white mt-2">{readyPickupCount}</div>
          <span className="text-xs text-emerald-400 mt-1 block font-medium">Scan QR / Token counter</span>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 mt-8 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Products & Menu Catalog ({foods.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Live Stock Adjuster</span>
        </button>

        <button
          onClick={() => setActiveTab('kitchen')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'kitchen'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Kitchen Orders Kanban ({activeKitchenCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Quick Pickup QR Scanner</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS & MENU CATALOG */}
      {activeTab === 'products' && (
        <div className="mt-6 space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food by name, ingredient, or tags..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Category selector */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold focus:outline-none focus:border-orange-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              {/* Veg selector */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setVegFilter('ALL')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    vegFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setVegFilter('VEG')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    vegFilter === 'VEG' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🟢 Veg
                </button>
                <button
                  onClick={() => setVegFilter('NON_VEG')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    vegFilter === 'NON_VEG' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔴 Non-Veg
                </button>
              </div>

              <button
                onClick={() => {
                  setFoodToEdit(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 p-4 flex flex-col justify-between transition-all group overflow-hidden relative shadow-lg"
              >
                <div>
                  {/* Food Image with Badges */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3.5">
                    <img
                      src={food.image || food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Veg indicator badge */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-slate-950/80 border border-slate-800 flex items-center gap-1 text-white">
                      <span className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      {food.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>

                    {/* Stock badge */}
                    <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md ${
                      !food.isAvailable || food.stock <= 0
                        ? 'bg-rose-500/80 text-white'
                        : food.stock < 10
                        ? 'bg-amber-500/80 text-white'
                        : 'bg-slate-950/80 text-slate-300 border border-slate-800'
                    }`}>
                      {food.stock <= 0 ? 'Out of Stock' : `${food.stock} left`}
                    </span>
                  </div>

                  {/* Food Details */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 block">
                        {food.category || 'General Menu'}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                        {food.name}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-display font-black text-emerald-400">
                        {formatCurrency(food.price)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {food.description || 'Prepared fresh at Apex Canteen kitchen counter.'}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {food.preparationTimeMinutes || food.preparationTime || 10} mins
                    </span>
                    {food.isSpecialToday && (
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        Today's Special
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Controls & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  {/* Stock adjuster buttons */}
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => handleStockAdjust(food, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs font-bold"
                      title="Decrease stock by 1"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold px-2 text-white">{food.stock || 0}</span>
                    <button
                      onClick={() => handleStockAdjust(food, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs font-bold"
                      title="Increase stock by 1"
                    >
                      +
                    </button>
                  </div>

                  {/* Availability toggle */}
                  <button
                    onClick={() => handleToggleAvailability(food)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors ${
                      food.isAvailable
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                    }`}
                  >
                    {food.isAvailable ? 'Available' : 'Unavailable'}
                  </button>

                  {/* Edit & Delete actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setFoodToEdit(food);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Edit food"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFood(food.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
                      title="Delete food"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFoods.length === 0 && (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
              <UtensilsCrossed className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400 mt-1">Try resetting your search or category filter.</p>
              <button
                onClick={() => {
                  setFoodToEdit(null);
                  setIsModalOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Product</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY & QUICK STOCK ADJUSTER */}
      {activeTab === 'inventory' && (
        <div className="mt-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Live Kitchen Inventory Counter</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quickly adjust available portions during peak breaks</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{foods.length} Menu Items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Quick Adjust</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {foods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.image || food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                          alt={food.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950"
                        />
                        <div>
                          <span className="font-bold text-white block">{food.name}</span>
                          <span className="text-xs text-slate-400 font-mono">{food.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-xs font-medium text-slate-300">
                      {food.category || 'Meals'}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {formatCurrency(food.price)}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                        (food.stock || 0) <= 0
                          ? 'bg-rose-500/20 text-rose-400'
                          : (food.stock || 0) < 10
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-800 text-slate-200'
                      }`}>
                        {food.stock || 0} portions
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStockAdjust(food, -5)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                          title="-5 portions"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleStockAdjust(food, -1)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                          title="-1 portion"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleStockAdjust(food, 1)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                          title="+1 portion"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleStockAdjust(food, 5)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                          title="+5 portions"
                        >
                          +5
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleAvailability(food)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          food.isAvailable && food.stock > 0
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {food.isAvailable && food.stock > 0 ? 'In Stock' : 'Sold Out'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KITCHEN ORDERS KANBAN */}
      {activeTab === 'kitchen' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Placed & Accepted */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Incoming Orders</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold">
                {orders.filter((o) => o.status === 'PLACED' || o.status === 'PAYMENT_CONFIRMED' || o.status === 'ACCEPTED').length}
              </span>
            </div>

            <div className="space-y-3">
              {orders
                .filter((o) => o.status === 'PLACED' || o.status === 'PAYMENT_CONFIRMED' || o.status === 'ACCEPTED')
                .map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black font-mono text-orange-400">Token #{ord.tokenNumber}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{formatTime(ord.createdAt)}</span>
                    </div>

                    <div className="space-y-1">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-300">
                          <span>{item.quantity}x {item.name || item.food?.name}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAdvanceOrderStatus(ord.id, 'PREPARING')}
                      className="w-full mt-2 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition"
                    >
                      Start Cooking →
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Column 2: Preparing */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Cooking Now</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold">
                {orders.filter((o) => o.status === 'PREPARING').length}
              </span>
            </div>

            <div className="space-y-3">
              {orders
                .filter((o) => o.status === 'PREPARING')
                .map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black font-mono text-indigo-400">Token #{ord.tokenNumber}</span>
                      <span className="text-[11px] text-indigo-300 font-mono">In Progress</span>
                    </div>

                    <div className="space-y-1">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-200 font-medium">
                          <span>{item.quantity}x {item.name || item.food?.name}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAdvanceOrderStatus(ord.id, 'READY')}
                      className="w-full mt-2 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition"
                    >
                      Mark Food Ready ✓
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Column 3: Ready for Pickup */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Ready at Counter</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
                {orders.filter((o) => o.status === 'READY').length}
              </span>
            </div>

            <div className="space-y-3">
              {orders
                .filter((o) => o.status === 'READY')
                .map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black font-mono text-emerald-400">Token #{ord.tokenNumber}</span>
                      <span className="text-[11px] text-emerald-400 font-bold animate-pulse">Call Customer</span>
                    </div>

                    <div className="space-y-1">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-300">
                          <span>{item.quantity}x {item.name || item.food?.name}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAdvanceOrderStatus(ord.id, 'COLLECTED')}
                      className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition"
                    >
                      Complete Handover →
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUICK PICKUP QR SCANNER & ORDER DETAILS */}
      {activeTab === 'scanner' && (
        <div className="mt-6 max-w-2xl mx-auto space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Scan Customer Token / QR Code</h3>
              <p className="text-xs text-slate-400 mt-1">
                Scan student QR code, enter token number (e.g. A001), or paste verification URL to inspect order details.
              </p>
            </div>

            <form onSubmit={handleVerifyQr} className="flex gap-2">
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="e.g. A001 or SQC-3132DF89436D48C6 or URL"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 uppercase"
              />
              <button
                type="submit"
                disabled={qrVerifying || !qrInput.trim()}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm transition flex items-center gap-2"
              >
                {qrVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Scan / Lookup'}
              </button>
            </form>

            {/* Quick Test Token Pills */}
            {orders.filter((o) => o.status !== 'COLLECTED' && o.status !== 'CANCELLED').length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">⚡ 1-Click Test Active Kitchen Orders:</span>
                <div className="flex flex-wrap gap-2">
                  {orders
                    .filter((o) => o.status !== 'COLLECTED' && o.status !== 'CANCELLED')
                    .slice(0, 6)
                    .map((ord) => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => {
                          setQrInput(ord.tokenNumber || ord.qrCodeIdentifier);
                          handleVerifyQr(null, ord.qrCodeIdentifier || ord.tokenNumber);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-mono font-bold text-orange-400 border border-slate-800 hover:border-orange-500/40 transition flex items-center gap-1.5"
                      >
                        <span>Token #{ord.tokenNumber}</span>
                        <span className="text-[10px] text-slate-500 font-sans">({ord.status})</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {qrError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{qrError}</span>
              </div>
            )}
          </div>

          {/* SCANNED ORDER DETAILS CARD */}
          {scannedOrderDetails && (
            <div className="rounded-3xl bg-gradient-to-br from-[#131B2E] to-slate-900 border border-slate-700/80 p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Scanned Order</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-display font-black text-orange-400 font-mono">
                      #{scannedOrderDetails.tokenNumber}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      scannedOrderDetails.status === 'COLLECTED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : scannedOrderDetails.status === 'READY'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    }`}>
                      {scannedOrderDetails.status}
                    </span>
                  </div>
                </div>

                <a
                  href={`/verify-order?qr=${encodeURIComponent(scannedOrderDetails.qrCodeIdentifier || scannedOrderDetails.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/30 transition"
                >
                  <span>Open Full Pass ↗</span>
                </a>
              </div>

              {/* Customer & Slot details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Customer</span>
                  <span className="font-bold text-white block truncate">{scannedOrderDetails.userName || 'Student'}</span>
                  <span className="text-slate-500 font-mono text-[10px] truncate">{scannedOrderDetails.userEmail || ''}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Pickup Slot</span>
                  <span className="font-bold text-emerald-400 block">{scannedOrderDetails.pickupSlotTime || 'Standard'}</span>
                  <span className="text-slate-500 text-[10px]">Counter 2 (Quick Pickup)</span>
                </div>
              </div>

              {/* Food Items List */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-800">
                  <span>Meal Items to Hand Over</span>
                  <span>Quantity</span>
                </div>
                {scannedOrderDetails.items?.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${it.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span className="text-white font-medium">{it.name || it.foodName || it.food?.name}</span>
                    </div>
                    <span className="font-mono font-bold text-orange-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      × {it.quantity}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="text-emerald-400 font-mono">{formatCurrency(scannedOrderDetails.finalAmount)}</span>
                </div>
              </div>

              {/* Handover Action Button */}
              {scannedOrderDetails.status === 'COLLECTED' ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Meal Already Handed Over to Customer</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConfirmHandover(scannedOrderDetails)}
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
              )}
            </div>
          )}
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <FoodModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFoodToEdit(null);
          }}
          foodToEdit={foodToEdit}
          categories={categories}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}
