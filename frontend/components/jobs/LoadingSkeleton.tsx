'use client';

import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 animate-pulse flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 bg-slate-800 rounded-md" />
            <div className="h-3 w-64 bg-slate-800/60 rounded-md" />
          </div>
          <div className="h-6 w-20 bg-slate-800 rounded-full" />
          <div className="h-8 w-24 bg-slate-800/80 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
