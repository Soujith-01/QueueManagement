import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, GraduationCap, ShieldCheck, LogOut, Award, Clock, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen pb-24 max-w-3xl mx-auto px-4 sm:px-6 pt-8">
      {/* Profile Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-display font-black text-3xl flex items-center justify-center shadow-xl shadow-orange-500/20">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-display font-black text-white">{user.name}</h1>
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                user.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                user.role === 'STAFF' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                user.role === 'FACULTY' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}>
                {user.role}
              </span>
            </div>

            <p className="text-sm text-slate-400 mt-1">{user.email}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <GraduationCap className="w-4 h-4 text-orange-400" />
                <span>ID: {user.studentId || user.facultyId || 'CAMPUS-PASS'}</span>
              </div>

              {user.phone && (
                <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-center">
            <ShoppingBag className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <span className="text-xl font-display font-black text-white">Smart Pass</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Quick Pickup Active</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-center">
            <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="text-xl font-display font-black text-white">~15 sec</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Average QR Pickup</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-center col-span-2 sm:col-span-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-xl font-display font-black text-white">Verified</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Campus Member</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
