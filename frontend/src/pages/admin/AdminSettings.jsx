import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, ArrowLeft, Save, CheckCircle2, ShieldCheck, Clock, Flame, Utensils } from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    canteenName: 'College Central Canteen',
    isOpen: true,
    maxSlotCapacity: 25,
    averagePrepTimeMinutes: 8,
    leaveNowMinutesThreshold: 5,
    quickPickupCounterActive: true,
    autoAcceptOrders: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.warn('Using default canteen settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      await adminService.updateSettings(settings);
      setSuccessMsg('Canteen configuration saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-black text-white">Canteen Operation Settings</h1>
            <p className="text-xs text-slate-400">Configure queue algorithm parameters and pickup rules</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Utensils className="w-4 h-4 text-orange-400" />
            <span>General Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Canteen Name</label>
              <input
                type="text"
                value={settings.canteenName}
                onChange={(e) => setSettings({ ...settings, canteenName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.isOpen}
                  onChange={(e) => setSettings({ ...settings, isOpen: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-950 border-slate-800"
                />
                <span className="text-sm font-medium text-white">Canteen Kitchen Currently Open</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Smart Queue & Prediction Algorithm</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Max Slot Capacity</label>
              <input
                type="number"
                value={settings.maxSlotCapacity}
                onChange={(e) => setSettings({ ...settings, maxSlotCapacity: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Orders limit per 10-minute window</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Average Prep Time (mins)</label>
              <input
                type="number"
                value={settings.averagePrepTimeMinutes}
                onChange={(e) => setSettings({ ...settings, averagePrepTimeMinutes: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Kitchen baseline per order</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Leave Now Alert (mins)</label>
              <input
                type="number"
                value={settings.leaveNowMinutesThreshold}
                onChange={(e) => setSettings({ ...settings, leaveNowMinutesThreshold: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Trigger notification before ready</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/20 active:scale-98 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
