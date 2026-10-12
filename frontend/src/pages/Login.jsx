import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Utensils, Mail, Lock, LogIn, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      // Route based on 3 distinct roles
      if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'CANTEEN_ADMIN' || user.role === 'STAFF') {
        navigate('/canteen-admin');
      } else {
        navigate(from === '/login' ? '/menu' : from);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login helper
  const handleDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-xl shadow-orange-500/20 mb-4">
          <Utensils className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-display font-black text-white tracking-tight">Smart QueueLess</h1>
        <p className="text-sm text-slate-400 mt-1">Sign in to pre-order and skip the canteen queue</p>
      </div>

      {/* Login Card */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="soujith@student.college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="text-xs">Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>1-Click Demo Accounts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer@canteen.com', 'password123')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-left transition-colors"
            >
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>🎓</span>
                Customer
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">customer@canteen.com</div>
              <div className="text-[9px] text-orange-400 mt-0.5 font-medium">Pre-order food & track</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('canteen@canteen.com', 'password123')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition-colors"
            >
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>🍳</span>
                Canteen Admin
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">canteen@canteen.com</div>
              <div className="text-[9px] text-amber-400 mt-0.5 font-medium">Add products & KDS</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('superadmin@canteen.com', 'password123')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-left transition-colors"
            >
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>🛡️</span>
                Super Admin
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">superadmin@canteen.com</div>
              <div className="text-[9px] text-rose-400 mt-0.5 font-medium">Analytics & users</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-orange-400 hover:text-orange-300">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
