import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowLeft, RefreshCw, MessageSquare, ThumbsUp } from 'lucide-react';
import adminService from '../../services/adminService';
import { formatTime } from '../../utils/formatters';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-black text-white">Meal Feedback & Ratings</h1>
            <p className="text-xs text-slate-400">Student & Faculty dining experience ratings</p>
          </div>
        </div>

        <button
          onClick={fetchReviews}
          className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading feedback...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Reviews Submitted Yet</h3>
            <p className="text-xs text-slate-400 mt-1">Customer meal reviews will appear here once submitted.</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{rev.user?.name || 'Customer'}</span>
                  {rev.user?.role && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {rev.user.role}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="py-3 text-sm text-slate-200">
                <p>{rev.comment || 'No written comment.'}</p>
                {rev.food && (
                  <span className="inline-block mt-2 text-xs text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                    Item: {rev.food.name}
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
                <span>Waiting Experience: {rev.waitingTimeRating ? `${rev.waitingTimeRating}/5` : 'Good'}</span>
                <span>{formatTime(rev.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
