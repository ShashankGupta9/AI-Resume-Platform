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
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-[#FF6803]/15 bg-[#0B0501]/90 backdrop-blur-xl min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {/* Platform Branding Badge */}
      <div className="p-3 bg-gradient-to-br from-[#1F120A] via-[#120C0A] to-[#0B0501] border border-[#FF6803]/20 rounded-2xl flex items-center gap-3 shadow-lg">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6803] to-[#AE3A02] flex items-center justify-center text-white shadow-md shadow-[#FF6803]/30">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-display font-extrabold text-white uppercase tracking-wider">
            Recruiter Suite
          </span>
          <span className="text-[10px] text-[#FF6803] font-semibold">
            {user?.companyName || 'Enterprise Plan'}
          </span>
        </div>
      </div>

      {/* Navigation Group */}
      <div className="flex-1 space-y-1.5">
        <span className="px-3 text-[10px] font-bold text-[#BFBFBF]/60 uppercase tracking-widest">
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
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF6803]/25 to-[#AE3A02]/15 text-white border border-[#FF6803]/40 shadow-inner'
                  : 'text-[#BFBFBF] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#FF6803]' : 'text-[#BFBFBF]/70 group-hover:text-white'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#FF6803]" />}
            </Link>
          );
        })}
      </div>

      {/* Recruiter Quick Card */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="p-3 bg-[#120C0A] border border-[#FF6803]/15 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6803] to-[#AE3A02] flex items-center justify-center text-white text-xs font-bold shadow">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'R'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-white truncate">
              {user?.fullName || 'Recruiter'}
            </span>
            <span className="text-[10px] text-[#BFBFBF] truncate">
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
