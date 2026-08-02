'use client';

import React from 'react';

interface FilterPanelProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export default function FilterPanel({ currentStatus, onStatusChange }: FilterPanelProps) {
  const tabs = [
    { label: 'All Jobs', value: 'ALL' },
    { label: 'Open', value: 'OPEN' },
    { label: 'Closed', value: 'CLOSED' },
    { label: 'Draft', value: 'DRAFT' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = currentStatus.toUpperCase() === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0 ${
              isActive
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
