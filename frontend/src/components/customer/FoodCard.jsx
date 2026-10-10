import React, { useState } from 'react';
import { Plus, Check, Clock, Star, Flame, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export const FoodCard = ({ food }) => {
  const { addItem, items } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const cartItem = items.find((i) => i.foodId === food.id);
  const isSoldOut = !food.isAvailable || food.stock <= 0;
  const isLowStock = food.stock > 0 && food.stock <= 5;

  const handleAdd = () => {
    if (isSoldOut) return;
    const ok = addItem(food, 1);
    if (ok) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1200);
    }
  };

  return (
    <div
      className={`group relative rounded-2xl bg-[#131B2E] border border-slate-800 hover:border-orange-500/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-950/20 ${
        isSoldOut ? 'opacity-70 grayscale-[30%]' : ''
      }`}
    >
      {/* Food Image & Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg / Non-Veg Icon */}
        <div className="absolute top-3 left-3 z-10">
          <div
            className={`w-6 h-6 rounded-md bg-slate-950/80 backdrop-blur-md border p-1 flex items-center justify-center ${
              food.isVeg ? 'border-emerald-500/60' : 'border-rose-500/60'
            }`}
            title={food.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
          {food.isSpecialToday && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
              <Flame className="w-3 h-3 fill-slate-950" /> SPECIAL
            </span>
          )}

          {isSoldOut ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-600 text-white tracking-wider">
              SOLD OUT
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-500/90 text-white animate-pulse">
              ONLY {food.stock} LEFT
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
              {food.stock} available
            </span>
          )}
        </div>

        {/* Prep Time pill */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-medium text-slate-300 border border-slate-700/50">
          <Clock className="w-3 h-3 text-orange-400" />
          <span>{food.preparationTimeMinutes || 8} mins prep</span>
        </div>
      </div>

      {/* Food Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-bold text-base text-white group-hover:text-orange-400 transition-colors line-clamp-1">
              {food.name}
            </h3>
            <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded text-xs font-semibold text-amber-400 border border-slate-800">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{food.rating ? food.rating.toFixed(1) : '4.5'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {food.description || 'Freshly prepared at campus canteen with authentic spices.'}
          </p>
        </div>

        {/* Price and Add Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 block -mb-0.5">Price</span>
            <span className="font-display font-extrabold text-lg text-white">
              {formatCurrency(food.price)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              isSoldOut
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : addedAnimation
                ? 'bg-emerald-500 text-white scale-95 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:brightness-110 active:scale-95 shadow-orange-500/20'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" /> Added
              </>
            ) : cartItem ? (
              <>
                <Plus className="w-4 h-4 stroke-[3]" /> In Cart ({cartItem.quantity})
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" /> Add to Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
