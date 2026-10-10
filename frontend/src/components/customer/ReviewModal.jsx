import React, { useState } from 'react';
import { X, Star, ThumbsUp, MessageSquare, Check } from 'lucide-react';
import { orderService } from '../../services/orderService';

export const ReviewModal = ({ order, isOpen, onClose, onReviewSubmitted }) => {
  const [foodRating, setFoodRating] = useState(5);
  const [waitTimeRating, setWaitTimeRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const firstFoodId = order.items?.[0]?.foodId;
      if (firstFoodId) {
        await orderService.submitReview({
          foodId: firstFoodId,
          orderId: order.id,
          rating: foodRating,
          waitTimeRating: waitTimeRating,
          comment: comment.trim(),
        });
      }
      setSubmitted(true);
      if (onReviewSubmitted) onReviewSubmitted();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-[#131B2E] border border-slate-700 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-400">Your review helps improve our canteen service.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white">Rate Your Canteen Meal</h3>
              <p className="text-xs text-slate-400">Order Token #{order.tokenNumber}</p>
            </div>

            {/* Food Taste Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Food Quality & Taste</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFoodRating(star)}
                    className="p-1 text-slate-600 hover:text-amber-400 transition"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= foodRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Queue & Wait Time Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Pickup Speed & Queue Experience</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setWaitTimeRating(star)}
                    className="p-1 text-slate-600 hover:text-orange-400 transition"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= waitTimeRating
                          ? 'fill-orange-400 text-orange-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Comments (Optional)</label>
              <textarea
                rows={3}
                placeholder="How was the preparation and pickup?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/20 transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
