'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  LayoutDashboard,
  Briefcase,
  Upload,
  Users,
  LogOut,
  Menu,
  X,
  Building2,
  Settings
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render navbar on login/register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Requisitions', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Upload Resume', href: '/resumes/upload', icon: Upload },
    { name: 'Candidates', href: '/resumes', icon: Users },
  ];

  return (
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all">
      <nav className="glass-panel rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between border border-[#FF6803]/20 shadow-2xl bg-[#0B0501]/85 backdrop-blur-2xl">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-full bg-gradient-to-tr from-[#FF6803] to-[#AE3A02] shadow-lg shadow-[#FF6803]/30 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-tight text-white group-hover:text-[#FF6803] transition-colors">
                PixelRise<span className="text-[#FF6803]">AI</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#BFBFBF] -mt-1">
                Recruiter Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links (Floating Pill Tabs) */}
        <div className="hidden md:flex items-center gap-1 bg-[#120C0A]/80 p-1 rounded-full border border-white/5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF6803] text-white shadow-md shadow-[#FF6803]/30'
                    : 'text-[#BFBFBF] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#BFBFBF]'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Action Bar */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 bg-[#1A110E] hover:bg-[#241713] border border-[#FF6803]/20 rounded-full py-1 px-3 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6803] to-[#AE3A02] flex items-center justify-center text-white text-[11px] font-bold shadow">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'R'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {user.fullName || 'Recruiter'}
                  </span>
                  <span className="text-[10px] text-[#BFBFBF] flex items-center gap-1">
                    <Building2 className="w-2.5 h-2.5 text-[#FF6803]" />
                    {user.companyName || 'Recruitment Corp'}
                  </span>
                </div>
              </Link>

              <Link
                href="/settings"
                className="p-2 text-[#BFBFBF] hover:text-white hover:bg-white/5 rounded-full transition-all"
                title="Account Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>

              <button
                onClick={() => logout()}
                className="p-2 text-[#BFBFBF] hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-[#BFBFBF] hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary px-5 py-2 text-xs"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#BFBFBF] hover:text-white rounded-full focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-panel rounded-3xl p-4 space-y-3 border border-[#FF6803]/20 bg-[#0B0501]/95 backdrop-blur-2xl">
          {user && (
            <div className="mb-3 pb-3 border-b border-white/10 flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6803] to-[#AE3A02] flex items-center justify-center text-white font-bold text-xs">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">{user.fullName}</span>
                <span className="text-[11px] text-[#BFBFBF]">{user.companyName} ({user.email})</span>
              </div>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#FF6803] text-white font-semibold'
                    : 'text-[#BFBFBF] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 rounded-full text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-semibold text-[#BFBFBF] border border-white/10 rounded-full"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center btn-primary py-2.5 text-xs font-semibold"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
