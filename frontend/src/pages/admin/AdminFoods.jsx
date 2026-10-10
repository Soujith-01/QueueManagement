import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, RefreshCw, Search, Package, Clock, IndianRupee } from 'lucide-react';
import foodService from '../../services/foodService';
import FoodModal from '../../components/admin/FoodModal';
import { formatCurrency } from '../../utils/formatters';

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const fetchFoodsAndCategories = async () => {
    try {
      setLoading(true);
      const [foodsRes, categoriesRes] = await Promise.allSettled([
        foodService.getAllFoods(),
        foodService.getAllCategories(),
      ]);

      if (foodsRes.status === 'fulfilled') {
        setFoods(foodsRes.value.data || []);
      }
      if (categoriesRes.status === 'fulfilled') {
        setCategories(categoriesRes.value.data || []);
      }
    } catch (err) {
      console.error('Failed to load foods', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodsAndCategories();
  }, []);

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      await foodService.deleteFood(id);
      setFoods((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete food');
    }
  };

  const filteredFoods = foods.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-black text-white">Food Menu Management</h1>
            <p className="text-xs text-slate-400">Add, edit, set pricing, prep times, and inventory</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedFood(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>

          <button
            onClick={fetchFoodsAndCategories}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food by name or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Foods Table */}
      <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Item</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6 text-center">Stock</th>
                <th className="py-4 px-6 text-center">Prep Time</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-500">
                    Loading foods...
                  </td>
                </tr>
              ) : filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-500">
                    No food items found.
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
                          <span className={`text-[10px] font-bold ${food.isVeg ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {food.isVeg ? '● VEG' : '▲ NON-VEG'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-400 font-medium">
                      {food.category?.name || 'General'}
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-white">
                      {formatCurrency(food.price)}
                    </td>

                    <td className="py-4 px-6 text-center font-mono">
                      <span className={`font-bold ${food.stock <= 5 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {food.stock}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center text-xs text-slate-400">
                      {food.preparationTime} mins
                    </td>

                    <td className="py-4 px-6 text-center">
                      {food.stock === 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                          SOLD OUT
                        </span>
                      ) : food.isAvailable ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-500">
                          OFFLINE
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedFood(food);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Edit Food"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Food"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <FoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        foodToEdit={selectedFood}
        categories={categories}
        onSaved={fetchFoodsAndCategories}
      />
    </div>
  );
}
