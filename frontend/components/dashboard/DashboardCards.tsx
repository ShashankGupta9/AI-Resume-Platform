'use client';

import React from 'react';
import { Briefcase, CheckCircle2, XCircle, FileText, TrendingUp } from 'lucide-react';
import { JobStats } from '@/services/jobApi';

interface DashboardCardsProps {
  stats: JobStats;
  isLoading?: boolean;
}

export default function DashboardCards({ stats, isLoading }: DashboardCardsProps) {
  const cards = [
    {
      title: 'Total Job Requisitions',
      value: stats.total_jobs,
      change: '+12% from last month',
      icon: Briefcase,
      color: 'from-indigo-600 to-cyan-600',
      shadow: 'shadow-indigo-500/20',
      badgeColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    },
    {
      title: 'Active Open Jobs',
      value: stats.open_jobs,
      change: 'Currently hiring',
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    },
    {
      title: 'Closed Requisitions',
      value: stats.closed_jobs,
      change: 'Positions filled',
      icon: XCircle,
      color: 'from-amber-600 to-rose-600',
      shadow: 'shadow-amber-500/20',
      badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    },
    {
      title: 'Total Applications Received',
      value: stats.total_applications,
      change: 'AI Evaluated Resumes',
      icon: FileText,
      color: 'from-purple-600 to-indigo-600',
      shadow: 'shadow-purple-500/20',
      badgeColor: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 animate-pulse space-y-3">
            <div className="h-4 w-24 bg-slate-800 rounded-md" />
            <div className="h-8 w-16 bg-slate-800 rounded-lg" />
            <div className="h-3 w-32 bg-slate-800/60 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 group relative overflow-hidden space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{card.title}</span>
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md ${card.shadow} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">
                {card.value}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${card.badgeColor} flex items-center gap-1`}>
                <TrendingUp className="w-2.5 h-2.5" />
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
