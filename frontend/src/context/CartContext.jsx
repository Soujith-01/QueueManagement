import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
    if (couponCode && items.length > 0) {
      applyCoupon(couponCode);
    } else if (items.length === 0) {
      setDiscountAmount(0);
      setCouponMessage('');
    }
  }, [items]);

  const addItem = (food, quantity = 1) => {
    if (!food || !food.isAvailable || food.stock <= 0) return false;

    setItems((prev) => {
      const existing = prev.find((item) => item.foodId === food.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, food.stock);
        return prev.map((item) =>
          item.foodId === food.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          foodId: food.id,
          name: food.name,
          price: food.price,
          image: food.image,
          isVeg: food.isVeg,
          stock: food.stock,
          prepTime: food.preparationTimeMinutes,
          quantity: Math.min(quantity, food.stock),
        },
      ];
    });
    return true;
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeItem(foodId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.foodId === foodId) {
          const newQty = Math.min(quantity, item.stock || 99);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (foodId) => {
    setItems((prev) => prev.filter((item) => item.foodId !== foodId));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountAmount(0);
    setCouponMessage('');
    setSelectedSlot(null);
    localStorage.removeItem('cart_items');
  };

  const applyCoupon = async (code) => {
    if (!code) {
      setDiscountAmount(0);
      setCouponCode('');
      setCouponMessage('');
      return;
    }
    try {
      const res = await orderService.applyCoupon(code, subtotal);
      if (res.valid) {
        setDiscountAmount(res.discountAmount);
        setCouponCode(res.code);
        setCouponMessage(res.message);
      } else {
        setDiscountAmount(0);
        setCouponMessage(res.message || 'Invalid coupon code');
      }
    } catch (e) {
      setDiscountAmount(0);
      setCouponMessage('Failed to apply coupon');
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
    setCouponMessage('');
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = 0.0;
  const finalTotal = Math.max(0, subtotal - discountAmount + tax);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        discountAmount,
        tax,
        finalTotal,
        selectedSlot,
        setSelectedSlot,
        couponCode,
        couponMessage,
        isDrawerOpen,
        setIsDrawerOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
