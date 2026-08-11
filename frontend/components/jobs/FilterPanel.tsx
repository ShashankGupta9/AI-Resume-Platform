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
    <div className="flex items-center gap-1 p-1 bg-[#120C0A] border border-[#FF6803]/20 rounded-full overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = currentStatus.toUpperCase() === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
              isActive
                ? 'bg-gradient-to-r from-[#FF6803] to-[#AE3A02] text-white shadow-md shadow-[#FF6803]/20'
                : 'text-[#BFBFBF] hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
