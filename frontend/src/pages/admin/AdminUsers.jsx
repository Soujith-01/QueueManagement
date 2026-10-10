import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowLeft, RefreshCw, Search, ShieldCheck, GraduationCap, Mail, Phone } from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.studentId?.toLowerCase().includes(q) ||
        u.facultyId?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen pb-24 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-black text-white">Campus User Directory</h1>
            <p className="text-xs text-slate-400">Manage student, faculty, and staff access</p>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          {['ALL', 'STUDENT', 'FACULTY', 'STAFF', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                roleFilter === r
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, roll..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Campus ID</th>
                <th className="py-4 px-6">Phone</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-200 font-bold flex items-center justify-center shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                        u.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-300' :
                        u.role === 'STAFF' ? 'bg-amber-500/20 text-amber-300' :
                        u.role === 'FACULTY' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono text-xs text-slate-300">
                      {u.studentId || u.facultyId || '---'}
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-400">
                      {u.phone || '---'}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
