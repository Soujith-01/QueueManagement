import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Sparkles, Utensils, AlertCircle, ArrowUpDown, Flame, Leaf } from 'lucide-react';
import foodService from '../services/foodService';
import FoodCard from '../components/customer/FoodCard';
import AiRecommendationBanner from '../components/customer/AiRecommendationBanner';

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('POPULAR');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const [foodsRes, categoriesRes] = await Promise.allSettled([
          foodService.getAllFoods(),
          foodService.getAllCategories(),
        ]);

        if (foodsRes.status === 'fulfilled') {
          const val = foodsRes.value;
          setFoods(Array.isArray(val) ? val : (val?.data || []));
        }
        if (categoriesRes.status === 'fulfilled') {
          const val = categoriesRes.value;
          setCategories(Array.isArray(val) ? val : (val?.data || []));
        }
      } catch (err) {
        console.error('Failed to load menu', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Filter & sort foods
  const filteredFoods = useMemo(() => {
    return foods
      .filter((food) => {
        // Category filter
        if (selectedCategory !== 'ALL' && food.category?.id !== selectedCategory && food.category?.name !== selectedCategory) {
          return false;
        }
        // Veg only filter
        if (vegOnly && !food.isVeg) {
          return false;
        }
        // Available only filter
        if (availableOnly && (!food.isAvailable || food.stock <= 0)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = food.name?.toLowerCase().includes(query);
          const matchDesc = food.description?.toLowerCase().includes(query);
          const matchCat = food.category?.name?.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'PRICE_ASC':
            return (a.price || 0) - (b.price || 0);
          case 'PRICE_DESC':
            return (b.price || 0) - (a.price || 0);
          case 'RATING':
            return (b.rating || 0) - (a.rating || 0);
          case 'TIME':
            return (a.preparationTime || 0) - (b.preparationTime || 0);
          case 'POPULAR':
          default:
            return (b.rating || 0) * (b.stock > 0 ? 1 : 0) - (a.rating || 0) * (a.stock > 0 ? 1 : 0);
        }
      });
  }, [foods, selectedCategory, vegOnly, availableOnly, searchQuery, sortBy]);

  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Utensils className="w-4 h-4" />
            <span>Today's Fresh Canteen Menu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white mt-1">
            Order Campus Food
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Biryani, Samosa, Tea..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* AI Meal & Combo Recommendations */}
      <div className="mt-6">
        <AiRecommendationBanner />
      </div>

      {/* Categories & Filter Bar */}
      <div className="mt-8 space-y-4">
        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Items ({foods.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Toggles */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                vegOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Veg Only</span>
            </button>

            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                availableOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>In Stock Only</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="POPULAR">Most Popular</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="RATING">Highest Rated</option>
              <option value="TIME">Fastest Prep</option>
            </select>
          </div>
        </div>
      </div>

      {/* Foods Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/80">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Food Items Found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or checking back during lunch hours.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setVegOnly(false);
                setAvailableOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
