'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { User, Building, Mail, ShieldCheck, ArrowLeft, Key } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full">
          Recruiter Profile
        </span>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'R'}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {user?.fullName || 'Recruiter Account'}
            </h1>
            <p className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>{user?.companyName || 'Recruitment Organization'}</span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name
            </span>
            <p className="text-sm font-bold text-slate-100">{user?.fullName || 'N/A'}</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" /> Company / Organization
            </span>
            <p className="text-sm font-bold text-slate-100">{user?.companyName || 'N/A'}</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" /> Work Email
            </span>
            <p className="text-sm font-bold text-slate-100">{user?.email || 'N/A'}</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Account Security Status
            </span>
            <p className="text-sm font-bold text-emerald-300">Verified Recruiter (JWT HttpOnly)</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
          <Link
            href="/settings"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>Account Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
