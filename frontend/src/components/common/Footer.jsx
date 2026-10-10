import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Clock, Shield, Sparkles, Heart } from 'lucide-react';
import { CANTEEN_NAME } from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Smart<span className="text-orange-500">QueueLess</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Smart Queue Management and Pre-Order System for College Canteens. Pre-order your food, skip the long queues, and collect when your token is ready.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-400" /> Canteen Hours: 08:00 AM – 08:00 PM
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Counter 2: Quick Pickup
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/menu" className="hover:text-orange-400 transition">Today's Menu</Link></li>
              <li><Link to="/orders" className="hover:text-orange-400 transition">Live Queue Tracker</Link></li>
              <li><Link to="/staff/kitchen" className="hover:text-orange-400 transition">Kitchen Display (KDS)</Link></li>
              <li><Link to="/admin" className="hover:text-orange-400 transition">Admin Analytics</Link></li>
            </ul>
          </div>

          {/* Demo Credentials Helper */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Demo Accounts</h4>
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-[11px] space-y-1.5 font-mono">
              <p><span className="text-orange-400 font-semibold">Student:</span> student@campus.edu / Student@123</p>
              <p><span className="text-indigo-400 font-semibold">Staff:</span> staff@canteen.edu / Staff@123</p>
              <p><span className="text-rose-400 font-semibold">Admin:</span> admin@canteen.edu / Admin@123</p>
              <p><span className="text-emerald-400 font-semibold">Faculty:</span> faculty@campus.edu / Faculty@123</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {CANTEEN_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for seamless campus dining <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
