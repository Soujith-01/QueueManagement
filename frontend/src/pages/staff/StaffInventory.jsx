import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, Plus, Minus, Search } from 'lucide-react';
import foodService from '../../services/foodService';
import { formatCurrency } from '../../utils/formatters';

export default function StaffInventory() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await foodService.getAllFoods();
      setFoods(res.data || []);
    } catch (err) {
      console.error('Failed to load food inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleStockAdjust = async (food, delta) => {
    const newStock = Math.max(0, (food.stock || 0) + delta);
    try {
      setUpdatingId(food.id);
      await foodService.updateStock(food.id, newStock);
      setFoods((prev) =>
        prev.map((f) => (f.id === food.id ? { ...f, stock: newStock, isAvailable: newStock > 0 } : f))
      );
    } catch (err) {
      alert('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleAvailable = async (food) => {
    const newAvailable = !food.isAvailable;
    try {
      setUpdatingId(food.id);
      await foodService.updateFood(food.id, {
        ...food,
        categoryId: food.category?.id,
        isAvailable: newAvailable,
      });
      setFoods((prev) =>
        prev.map((f) => (f.id === food.id ? { ...f, isAvailable: newAvailable } : f))
      );
    } catch (err) {
      alert('Failed to toggle availability');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredFoods = foods.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/staff"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-black text-white">Live Kitchen Stock</h1>
            <p className="text-xs text-slate-400">Atomic inventory management to prevent food shortages</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            onClick={fetchFoods}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Food Item</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6 text-center">Remaining Stock</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    Loading live stock data...
                  </td>
                </tr>
              ) : filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    No items found matching your search.
                  </td>
                </tr>
              ) : (
                filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                          alt={food.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block">{food.name}</span>
                          <span className="text-xs text-slate-500">{food.category?.name || 'General'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono font-medium text-slate-200">
                      {formatCurrency(food.price)}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                        <button
                          onClick={() => handleStockAdjust(food, -5)}
                          disabled={food.stock <= 0 || updatingId === food.id}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                          title="-5 stock"
                        >
                          -5
                        </button>
                        <span className={`font-mono font-black text-sm px-2 ${food.stock <= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {food.stock}
                        </span>
                        <button
                          onClick={() => handleStockAdjust(food, 10)}
                          disabled={updatingId === food.id}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                          title="+10 stock"
                        >
                          +10
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {food.stock === 0 ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          SOLD OUT
                        </span>
                      ) : food.isAvailable ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          AVAILABLE
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                          HIDDEN
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleAvailable(food)}
                        disabled={updatingId === food.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          food.isAvailable
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {food.isAvailable ? 'Mark Sold Out' : 'Mark In Stock'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
