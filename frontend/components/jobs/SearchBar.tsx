'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search job title, department, or location...' }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#BFBFBF]">
        <Search className="w-4 h-4 text-[#FF6803]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-[#120C0A] border border-[#FF6803]/20 rounded-full text-xs text-white placeholder-[#BFBFBF]/60 focus:outline-none focus:ring-2 focus:ring-[#FF6803]/50 focus:border-[#FF6803] transition-all shadow-inner"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#BFBFBF] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
