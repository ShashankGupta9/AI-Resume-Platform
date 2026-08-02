'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pages, total, limit, onPageChange }: PaginationProps) {
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
      <div>
        Showing <span className="font-semibold text-slate-200">{start}</span> to{' '}
        <span className="font-semibold text-slate-200">{end}</span> of{' '}
        <span className="font-semibold text-slate-200">{total}</span> requisitions
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-semibold text-slate-200 bg-slate-900 border border-slate-800 rounded-lg">
          Page {page} of {pages || 1}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
