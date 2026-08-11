'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Upload,
  BrainCircuit,
  TrendingUp,
  CheckCircle2,
  Zap,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section - Inspired by Pixel Rise Typography & Layout */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-12 border border-[#FF6803]/20 overflow-hidden shadow-2xl bg-[#0B0501]/80">
        {/* Background Ambient Orange Glow Spotlights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#FF6803]/20 via-[#AE3A02]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial from-[#FF6803]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Bold Headline & CTA */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="pill-badge">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6803]" />
                <span>[1/8] RECRUITER AI ENGINE</span>
              </span>
              <span className="text-xs font-semibold text-[#BFBFBF]">
                Intelligent Resume Parsing & Skill Matching
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[1.08]">
              Building Digital <br />
              <span className="bg-gradient-to-r from-[#FF6803] via-amber-400 to-white bg-clip-text text-transparent">
                Hiring Pipelines
              </span> <br />
              That Match Fast
            </h1>

            <p className="text-sm sm:text-base text-[#BFBFBF] max-w-xl leading-relaxed font-normal">
              Empower your recruitment team to create job requisitions, extract skills from candidate PDF and DOCX resumes, and compute precise AI match scores in seconds.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {user ? (
                <Link
                  href="/dashboard"
                  className="btn-primary px-8 py-3.5 text-sm flex items-center gap-2"
                >
                  <span>Go to Recruiter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="btn-primary px-8 py-3.5 text-sm flex items-center gap-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="btn-secondary px-8 py-3.5 text-sm"
                  >
                    Recruiter Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column: High-Impact Growth & Performance Widget (Pixel Rise Reference) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-[#FF6803]/25 bg-[#120C0A]/90 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#BFBFBF]">
                  Evaluation Efficiency
                </span>
                <div className="p-2 rounded-full bg-[#FF6803]/15 text-[#FF6803]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-display font-black text-white">
                    ↑ 148%
                  </span>
                  <span className="text-xs font-bold text-[#FF6803]">MATCH SPEED</span>
                </div>
                <p className="text-xs text-[#BFBFBF] mt-1 leading-relaxed">
                  Our clients see measurable hiring pipeline acceleration through automated AI skill scoring.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#BFBFBF]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6803]" />
                  Supabase Verified
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  PDF & DOCX Support
                </span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-[#120C0A]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-[#FF6803] to-[#AE3A02] text-white">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Enterprise Ready</h4>
                  <p className="text-[10px] text-[#BFBFBF]">JWT Cookie Security & PostgreSQL</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#FF6803]">[v2.0]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-[#FF6803]/20 space-y-4 relative overflow-hidden group">
          <div className="p-3 bg-gradient-to-tr from-[#FF6803]/20 to-[#AE3A02]/10 text-[#FF6803] w-fit rounded-2xl border border-[#FF6803]/30">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-white group-hover:text-[#FF6803] transition-colors">
              Smart Job Requisitions
            </h3>
            <p className="text-xs text-[#BFBFBF] leading-relaxed">
              Define detailed job requirements, skill tags, salary ranges, location parameters, and experience criteria.
            </p>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-[#FF6803]/20 space-y-4 relative overflow-hidden group">
          <div className="p-3 bg-gradient-to-tr from-[#FF6803]/20 to-[#AE3A02]/10 text-[#FF6803] w-fit rounded-2xl border border-[#FF6803]/30">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-white group-hover:text-[#FF6803] transition-colors">
              Multi-Format CV Parsing
            </h3>
            <p className="text-xs text-[#BFBFBF] leading-relaxed">
              Drag & drop candidate resumes in PDF and DOCX formats with real-time PyMuPDF text extraction.
            </p>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-[#FF6803]/20 space-y-4 relative overflow-hidden group">
          <div className="p-3 bg-gradient-to-tr from-[#FF6803]/20 to-[#AE3A02]/10 text-[#FF6803] w-fit rounded-2xl border border-[#FF6803]/30">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-white group-hover:text-[#FF6803] transition-colors">
              AI Skill Match Scoring
            </h3>
            <p className="text-xs text-[#BFBFBF] leading-relaxed">
              Instantly calculate match percentages, extract candidate competencies, and generate summary insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
