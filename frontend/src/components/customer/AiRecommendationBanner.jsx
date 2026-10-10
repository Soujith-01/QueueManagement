import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Clock, Plus, Flame, ShieldAlert } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { CROWD_COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const AiRecommendationBanner = () => {
  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAiData = async () => {
      try {
        const [predRes, recRes] = await Promise.all([
          aiService.getQueuePrediction(),
          aiService.getRecommendations(),
        ]);
        setPrediction(predRes);
        setRecommendations(recRes);
      } catch (e) {
        console.error('Failed to load AI data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadAiData();
  }, []);

  if (loading || !prediction) return null;

  const crowdBadgeColor = CROWD_COLORS[prediction.currentCrowdStatus] || CROWD_COLORS.MEDIUM;

  return (
    <div className="space-y-4">
      {/* AI Queue Crowd Forecast Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#131B2E] to-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Sparkles className="w-3.5 h-3.5" /> AI QUEUE INTELLIGENCE
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${crowdBadgeColor}`}>
                {prediction.currentCrowdStatus} CROWD
              </span>
            </div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
              Peak Rush Hours Expected: <span className="text-orange-400">{prediction.peakTimeRange}</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {prediction.insightSummary}
            </p>
          </div>

          {/* Recommended Action Pill */}
          <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Best Time to Order</span>
              <span className="text-xs font-bold text-emerald-400">{prediction.recommendedOrderTime}</span>
            </div>
          </div>
        </div>

        {/* 15-Minute Interval Timeline Forecast */}
        {prediction.hourlyForecast && (
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 mb-2 block">Lunch Rush Forecast by Time Slot:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {prediction.hourlyForecast.map((slot, idx) => {
                const color = CROWD_COLORS[slot.crowdLevel] || CROWD_COLORS.LOW;
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1"
                  >
                    <span className="text-[10px] text-slate-400 block truncate">{slot.timeSlot.split('-')[0]}</span>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold border ${color}`}>
                      {slot.crowdLevel}
                    </span>
                    <span className="text-[10px] text-slate-500 block">~{slot.estimatedWaitMinutes}m wait</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Suggested Meal Combos */}
      {recommendations?.suggestedCombos && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <h4 className="text-sm font-bold text-white">AI Chef-Curated Lunch Combos</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.suggestedCombos.map((combo, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#131B2E] border border-slate-800 hover:border-orange-500/30 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-semibold text-sm text-white">{combo.title}</h5>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Save {formatCurrency(combo.savings)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{combo.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="font-display font-extrabold text-base text-orange-400">
                    {formatCurrency(combo.comboPrice)}
                  </span>
                  <span className="text-[11px] text-slate-500 italic">Combo special</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiRecommendationBanner;
