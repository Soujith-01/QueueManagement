import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  ChefHat,
  ShieldAlert,
  Bell,
  User as UserIcon,
  LogOut,
  Menu as MenuIcon,
  X,
  QrCode,
  Sparkles,
  Layers,
  Package,
  Settings,
  Users,
  Ticket,
  Star,
  ChevronDown,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSocket } from '../../context/SocketContext';

export const Navbar = () => {
  const { user, logout, isCustomer, isCanteenAdmin, isSuperAdmin } = useAuth();
  const { totalItems, setIsDrawerOpen } = useCart();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const { connected } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Compute active role badge info
  const getRoleBadge = () => {
    if (isSuperAdmin) {
      return { label: 'Super Admin', icon: '🛡️', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
    }
    if (isCanteenAdmin) {
      return { label: 'Canteen Admin', icon: '🍳', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
    }
    return { label: 'Customer', icon: '🎓', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' };
  };

  const currentBadge = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with dynamic role subtitle */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
              isSuperAdmin 
                ? 'bg-gradient-to-tr from-rose-600 to-amber-500 shadow-rose-500/20' 
                : isCanteenAdmin
                ? 'bg-gradient-to-tr from-amber-600 to-orange-500 shadow-amber-500/20'
                : 'bg-gradient-to-tr from-orange-600 to-amber-500 shadow-orange-500/20'
            }`}>
              {isSuperAdmin ? (
                <ShieldAlert className="w-5 h-5 text-white" />
              ) : isCanteenAdmin ? (
                <ChefHat className="w-5 h-5 text-white" />
              ) : (
                <UtensilsCrossed className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg text-white tracking-tight">
                  Smart<span className={isSuperAdmin ? 'text-rose-400' : isCanteenAdmin ? 'text-amber-400' : 'text-orange-500'}>QueueLess</span>
                </span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase ${currentBadge.color}`}>
                  {isSuperAdmin ? 'SUPER ADMIN' : isCanteenAdmin ? 'CANTEEN ADMIN' : 'CUSTOMER'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                {isSuperAdmin 
                  ? 'University Executive Governance Directorate' 
                  : isCanteenAdmin 
                  ? 'Canteen Kitchen Operations & Menu Management' 
                  : 'Apex University Smart Canteen Pre-Order'}
              </p>
            </div>
          </Link>

          {/* Role-Specific Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* 1. CUSTOMER NAVIGATION */}
            {(isCustomer || !user) && (
              <>
                <Link
                  to="/menu"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/menu')
                      ? 'bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Explore Menu
                </Link>

                <Link
                  to="/orders"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/orders')
                      ? 'bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  My Orders
                </Link>
              </>
            )}

            {/* 2. CANTEEN ADMIN NAVIGATION */}
            {isCanteenAdmin && (
              <>
                <Link
                  to="/canteen-admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/canteen-admin')
                      ? 'bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30'
                      : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/40'
                  }`}
                >
                  <ChefHat className="w-4 h-4" />
                  Canteen Operations
                </Link>

                <Link
                  to="/staff/kitchen"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/staff/kitchen')
                      ? 'bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30'
                      : 'text-indigo-300 hover:text-indigo-200 hover:bg-indigo-950/40'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  KDS Kitchen
                </Link>

                <Link
                  to="/staff/scan"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/staff/scan')
                      ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30'
                      : 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-950/40'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  Quick Pickup Scan
                </Link>

                <Link
                  to="/staff/inventory"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/staff/inventory')
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Live Stock
                </Link>
              </>
            )}

            {/* 3. SUPER ADMIN NAVIGATION */}
            {isSuperAdmin && (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin')
                      ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30'
                      : 'text-rose-300 hover:text-rose-200 hover:bg-rose-950/40'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Analytics
                </Link>

                <Link
                  to="/admin/users"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/users')
                      ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Users & Roles
                </Link>

                <Link
                  to="/admin/settings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/settings')
                      ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Canteen Settings
                </Link>

                <Link
                  to="/admin/slots"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/slots')
                      ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Time Slots
                </Link>

                <Link
                  to="/admin/coupons"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/coupons')
                      ? 'bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  Coupons
                </Link>

                <Link
                  to="/canteen-admin"
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors flex items-center gap-1"
                  title="Switch to operational Canteen Admin view"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  Canteen View
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live WebSocket connection pulse */}
            <div
              className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-slate-900/80 border border-slate-800"
              title={connected ? 'Connected to live canteen stream' : 'Reconnecting...'}
            >
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[11px] text-slate-400">{connected ? 'Live Sync' : 'Connecting'}</span>
            </div>

            {/* Active User Role Badge */}
            {user && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200">
                <span>{currentBadge.icon}</span>
                <span className="hidden sm:inline">{currentBadge.label}</span>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    <Link
                      to="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs text-orange-400 hover:text-orange-300 font-medium"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-500">No new alerts</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.read && !n.isRead) markAsRead(n.id);
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-xl text-xs transition cursor-pointer ${
                            n.read || n.isRead ? 'bg-slate-950/50 text-slate-400' : 'bg-orange-500/10 border border-orange-500/20 text-slate-200'
                          }`}
                        >
                          <div className="font-semibold text-white mb-0.5">{n.title}</div>
                          <div className="text-slate-400 line-clamp-2">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button (For Customers / Guests) */}
            {(isCustomer || !user) && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-all flex items-center gap-1.5"
                title="View cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-orange-500 text-white">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSuperAdmin 
                      ? 'bg-rose-500/20 text-rose-400' 
                      : isCanteenAdmin 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">{user.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role?.toLowerCase()?.replace('_', ' ')}</p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${currentBadge.color}`}>
                        {user.role?.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="py-1">
                      {isCustomer && (
                        <>
                          <Link
                            to="/orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                          >
                            <Clock className="w-4 h-4" /> My Orders & QR Passes
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                          >
                            <UserIcon className="w-4 h-4" /> Profile Details
                          </Link>
                        </>
                      )}

                      {isCanteenAdmin && (
                        <>
                          <Link
                            to="/canteen-admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:text-white hover:bg-slate-800 rounded-lg"
                          >
                            <ChefHat className="w-4 h-4" /> Canteen Operations Portal
                          </Link>
                          <Link
                            to="/staff/scan"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                          >
                            <QrCode className="w-4 h-4" /> QR Pickup Scanner
                          </Link>
                        </>
                      )}

                      {isSuperAdmin && (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-rose-300 hover:text-white hover:bg-slate-800 rounded-lg"
                          >
                            <ShieldAlert className="w-4 h-4" /> Executive Dashboard
                          </Link>
                          <Link
                            to="/admin/users"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                          >
                            <Users className="w-4 h-4" /> User Management
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Role-Aware Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {/* Customer links */}
          {(isCustomer || !user) && (
            <>
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900"
              >
                🍔 Browse Food Menu
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900"
              >
                ⏱️ My Orders & Live Queue
              </Link>
            </>
          )}

          {/* Canteen Admin links */}
          {isCanteenAdmin && (
            <>
              <Link
                to="/canteen-admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-slate-900 font-bold"
              >
                🍳 Canteen Operations & Products
              </Link>
              <Link
                to="/staff/kitchen"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-indigo-400 hover:bg-slate-900"
              >
                👨‍🍳 Kitchen Display (KDS)
              </Link>
              <Link
                to="/staff/scan"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:bg-slate-900"
              >
                📷 Quick Pickup Scanner
              </Link>
              <Link
                to="/staff/inventory"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900"
              >
                📦 Inventory Stock Counter
              </Link>
            </>
          )}

          {/* Super Admin links */}
          {isSuperAdmin && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-slate-900 font-bold"
              >
                🛡️ Executive Analytics Dashboard
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900"
              >
                👥 User Management
              </Link>
              <Link
                to="/admin/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900"
              >
                ⚙️ Canteen Settings
              </Link>
              <Link
                to="/admin/slots"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900"
              >
                ⏱️ Pickup Time Slots
              </Link>
              <Link
                to="/admin/coupons"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900"
              >
                🏷️ Promo Coupons
              </Link>
              <Link
                to="/canteen-admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-slate-900"
              >
                🍳 Switch to Canteen Operations
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
