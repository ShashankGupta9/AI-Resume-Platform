'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  Upload,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Job Requisitions',
      href: '/dashboard/jobs',
      icon: Briefcase,
      exact: false,
    },
    {
      name: 'Create Job Requisition',
      href: '/dashboard/jobs/create',
      icon: PlusCircle,
      exact: true,
    },
    {
      name: 'Candidate Resumes',
      href: '/resumes',
      icon: Users,
      exact: false,
    },
    {
      name: 'Upload Resume',
      href: '/resumes/upload',
      icon: Upload,
      exact: true,
    },
    {
      name: 'Recruiter Profile',
      href: '/profile',
      icon: User,
      exact: true,
    },
    {
      name: 'Account Settings',
      href: '/settings',
      icon: Settings,
      exact: true,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {/* Platform Branding Badge */}
      <div className="p-3 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
            Recruiter Suite
          </span>
          <span className="text-[10px] text-cyan-400 font-semibold">
            {user?.companyName || 'Enterprise Plan'}
          </span>
        </div>
      </div>

      {/* Navigation Group */}
      <div className="flex-1 space-y-1.5">
        <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Core Requisitions
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-600/20 text-white border border-indigo-500/40 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
            </Link>
          );
        })}
      </div>

      {/* Recruiter Quick Card */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'R'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-200 truncate">
              {user?.fullName || 'Recruiter'}
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              {user?.email || 'authenticated'}
            </span>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 rounded-xl transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
