'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = 'No Job Requisitions Found',
  description = 'You have not created any job requisitions matching the criteria yet.',
  actionText = 'Create New Job',
  actionHref = '/dashboard/jobs/create',
}: EmptyStateProps) {
  return (
    <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
        <Briefcase className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">{description}</p>
      </div>

      {actionHref && (
        <div className="pt-2">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{actionText}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
