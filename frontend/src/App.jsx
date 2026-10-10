import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/customer/CartDrawer';
import OfflineBanner from './components/common/OfflineBanner';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import VerifyOrder from './pages/VerifyOrder';

// Canteen Admin Portal & Staff Pages
import CanteenAdminDashboard from './pages/canteen/CanteenAdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import KitchenDisplay from './pages/staff/KitchenDisplay';
import StaffScan from './pages/staff/StaffScan';
import StaffInventory from './pages/staff/StaffInventory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFoods from './pages/admin/AdminFoods';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSlots from './pages/admin/AdminSlots';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  const location = useLocation();
  const isKdsPage = location.pathname === '/staff/kitchen';

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-orange-500 selection:text-white">
      <OfflineBanner />
      
      {/* Hide navbar & footer on full-screen KDS */}
      {!isKdsPage && <Navbar />}
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-order" element={<VerifyOrder />} />
          <Route path="/verify-order/:id" element={<VerifyOrder />} />

          {/* Customer Authenticated Routes */}
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Canteen Admin Dedicated Portal & Staff Routes */}
          <Route
            path="/canteen-admin"
            element={
              <ProtectedRoute allowedRoles={['CANTEEN_ADMIN', 'STAFF', 'SUPER_ADMIN', 'ADMIN']}>
                <CanteenAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/canteen-admin/products"
            element={
              <ProtectedRoute allowedRoles={['CANTEEN_ADMIN', 'STAFF', 'SUPER_ADMIN', 'ADMIN']}>
                <CanteenAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['CANTEEN_ADMIN', 'STAFF', 'SUPER_ADMIN', 'ADMIN']}>
                <CanteenAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/kitchen"
            element={
              <ProtectedRoute allowedRoles={['CANTEEN_ADMIN', 'STAFF', 'SUPER_ADMIN', 'ADMIN']}>
                <KitchenDisplay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/scan"
            element={
              <ProtectedRoute allowedRoles={['CANTEEN_ADMIN', 'STAFF', 'SUPER_ADMIN', 'ADMIN']}>
                <StaffScan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/inventory"
            element={
              <ProtectedRoute allowedRoles={['CANTEEN_ADMIN', 'STAFF', 'SUPER_ADMIN', 'ADMIN']}>
                <StaffInventory />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Executive Directorate Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/foods"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CANTEEN_ADMIN', 'STAFF']}>
                <AdminFoods />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CANTEEN_ADMIN', 'STAFF']}>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/slots"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminSlots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminCoupons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isKdsPage && <CartDrawer />}
      {!isKdsPage && <Footer />}
    </div>
  );
}
