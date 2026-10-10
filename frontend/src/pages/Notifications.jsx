import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatTime } from '../utils/formatters';

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen pb-24 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Bell className="w-4 h-4" />
            <span>Activity Alerts</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white mt-1">Notifications</h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Notifications</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            You will receive instant alerts here when your food starts preparing, is ready for pickup, or when queues change.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && markAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !notif.isRead
                  ? 'bg-slate-900 border-orange-500/30 shadow-md shadow-orange-500/5'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  !notif.isRead ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>

                <div>
                  <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-white' : 'text-slate-300'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[11px] text-slate-500 font-mono mt-1.5 block">
                    {formatTime(notif.createdAt)}
                  </span>
                </div>
              </div>

              {notif.orderId && (
                <Link
                  to={`/order/${notif.orderId}`}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 transition-colors"
                  title="View Order"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
