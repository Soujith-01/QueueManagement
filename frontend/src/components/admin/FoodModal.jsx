import React, { useState, useEffect } from 'react';
import { X, Upload, IndianRupee, Clock, Package } from 'lucide-react';
import foodService from '../../services/foodService';

export default function FoodModal({ isOpen, onClose, foodToEdit, onSaved, categories = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    stock: 50,
    preparationTime: 10,
    isVeg: true,
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (foodToEdit) {
      setFormData({
        name: foodToEdit.name || '',
        description: foodToEdit.description || '',
        price: foodToEdit.price || '',
        categoryId: foodToEdit.category?.id || categories[0]?.id || '',
        imageUrl: foodToEdit.imageUrl || '',
        stock: foodToEdit.stock ?? 50,
        preparationTime: foodToEdit.preparationTime ?? 10,
        isVeg: foodToEdit.isVeg ?? true,
        isAvailable: foodToEdit.isAvailable ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: categories[0]?.id || '',
        imageUrl: '',
        stock: 50,
        preparationTime: 10,
        isVeg: true,
        isAvailable: true,
      });
    }
  }, [foodToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const selectedCategoryObj = categories.find(
        (c) => c.id === formData.categoryId || c.name === formData.categoryId
      );
      const categoryName = selectedCategoryObj ? selectedCategoryObj.name : (formData.categoryId || (categories[0]?.name || 'Meals'));
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        price: parseFloat(formData.price),
        category: categoryName,
        image: formData.imageUrl || formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
        stock: parseInt(formData.stock, 10) || 50,
        preparationTimeMinutes: parseInt(formData.preparationTime, 10) || 10,
        isVeg: !!formData.isVeg,
        isAvailable: formData.isAvailable !== false,
        isSpecialToday: !!formData.isSpecialToday,
        tags: Array.isArray(formData.tags) ? formData.tags : ['Chef Special'],
      };

      if (foodToEdit) {
        await foodService.updateFood(foodToEdit.id, payload);
      } else {
        await foodService.createFood(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save food item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-display font-bold text-white">
            {foodToEdit ? 'Edit Food Item' : 'Add New Food Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-950/50 border border-rose-500/30 text-rose-300 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Food Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Hyderabadi Veg Biryani"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Price (₹) *</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="80"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Initial Stock *</label>
              <div className="relative">
                <Package className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="50"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Prep Time (mins) *</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  value={formData.preparationTime}
                  onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                  placeholder="10"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Image URL (Unsplash or direct link)</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Delicious aromatic basmati rice cooked with fresh vegetables and secret spices..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 md:col-span-2 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVeg}
                  onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-950 border-slate-800"
                />
                <span className="text-sm font-medium text-slate-300">Pure Vegetarian (Veg)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-0 bg-slate-950 border-slate-800"
                />
                <span className="text-sm font-medium text-slate-300">Available Today</span>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold shadow-lg shadow-orange-500/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : foodToEdit ? 'Update Food' : 'Create Food'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
