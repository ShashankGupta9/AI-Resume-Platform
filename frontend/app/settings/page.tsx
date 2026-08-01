'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Settings, Shield, ArrowLeft, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Settings Updated', 'Account security configuration saved.');
  };

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
        <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full">
          Account Settings
        </span>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="space-y-1 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <span>Recruiter Suite Settings</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage session preferences, notification rules, and JWT authentication security.
          </p>
        </div>

        <form onSubmit={handleSaveSecurity} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Authentication & Session Security</span>
            </h3>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">HttpOnly Session Cookies</h4>
                <p className="text-xs text-slate-400">Enforce secure HttpOnly cookies for JWT tokens</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
                Active
              </span>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Automatic Session Timeout</h4>
                <p className="text-xs text-slate-400">JWT Access Tokens expire automatically after 7 days</p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-full">
                7 Days
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => logout()}
              className="px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Platform</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-500/20"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
