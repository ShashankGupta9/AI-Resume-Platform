'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Upload,
  BrainCircuit
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 max-w-4xl mx-auto pt-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-600/30 to-cyan-500/30 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Next-Gen AI Hiring & Resume Screening Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Hire Top Talent 10x Faster with{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Resume Match Scoring
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Create job requisitions, parse PDF and DOCX candidate resumes automatically, and uncover perfect skill matches with enterprise-grade AI analytics.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {user ? (
            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <span>Go to Recruiter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm rounded-2xl transition-all"
              >
                Sign In to Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 w-fit rounded-2xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Smart Job Requisitions</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create job postings with required skill tags, salary ranges, location criteria, and experience parameters.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 w-fit rounded-2xl">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Multi-Format CV Parsing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Drag and drop candidate resumes in PDF and DOCX formats with real-time text extraction and Supabase storage.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 w-fit rounded-2xl">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">AI Match Scoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instantly calculate percentage match scores, extract candidate competencies, and highlight key strengths.
          </p>
        </div>
      </div>
    </div>
  );
}
