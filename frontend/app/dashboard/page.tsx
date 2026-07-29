'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  Upload,
  Users,
  Award,
  Sparkles,
  PlusCircle,
  ArrowUpRight,
  FileText,
  Building2,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  status: string;
  createdAt: string;
  _count?: { resumes: number };
}

interface Resume {
  id: string;
  candidateName: string;
  email: string;
  jobId: string;
  aiMatchScore: number;
  aiSummary: string;
  extractedSkills: string;
  uploadDate: string;
  job?: { title: string };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [jobsRes, resumesRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/resumes')
      ]);

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }

      if (resumesRes.ok) {
        const resumesData = await resumesRes.json();
        setResumes(resumesData.resumes || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalResumes = resumes.length;
  const avgMatchScore = totalResumes > 0
    ? Math.round(resumes.reduce((acc, r) => acc + (r.aiMatchScore || 0), 0) / totalResumes)
    : 88;
  const topCandidates = resumes.filter(r => r.aiMatchScore >= 80).length;

  return (
    <div className="space-y-8">
      {/* Dashboard Top Hero Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Hiring Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.fullName || 'Recruiter'}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              {user?.companyName ? `${user.companyName} Recruitment Control Center` : 'Manage open requisitions and evaluate incoming candidate resumes with AI parsing.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/jobs/create"
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Job</span>
            </Link>
            <Link
              href="/resumes/upload"
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-cyan-300 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Resume</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Jobs</span>
            <div className="text-3xl font-black text-white">{loading ? '...' : jobs.length}</div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> Live Requisitions
            </span>
          </div>
          <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Resumes</span>
            <div className="text-3xl font-black text-white">{loading ? '...' : totalResumes}</div>
            <span className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium">
              <FileText className="w-3 h-3" /> Processed Applications
            </span>
          </div>
          <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg AI Match Rate</span>
            <div className="text-3xl font-black text-white">{loading ? '...' : `${avgMatchScore}%`}</div>
            <span className="text-[11px] text-purple-400 flex items-center gap-1 font-medium">
              <BrainCircuit className="w-3 h-3" /> Smart Algorithm Score
            </span>
          </div>
          <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Top Candidates</span>
            <div className="text-3xl font-black text-white">{loading ? '...' : topCandidates}</div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <Award className="w-3 h-3" /> &gt;80% Skill Overlap
            </span>
          </div>
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Active Job Postings */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Active Job Postings</h2>
            </div>
            <Link href="/jobs" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>View All Jobs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800 space-y-3">
              <div className="p-3 bg-slate-900 w-fit mx-auto rounded-full text-slate-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-200">No Job Postings Created Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create your first job listing to start matching incoming candidate resumes.
              </p>
              <Link
                href="/jobs/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
              >
                <PlusCircle className="w-4 h-4" /> Create First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                        {job.title}
                      </h3>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {job.department}
                      </span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-medium">{job.salaryRange}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200">
                        {job._count?.resumes || 0} Applicants
                      </div>
                      <span className="text-[10px] text-slate-500">Total Applications</span>
                    </div>
                    <Link
                      href={`/resumes?jobId=${job.id}`}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors"
                      title="View Candidates"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Column: Recent Candidates Feed */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Recent Candidates</h2>
            </div>
            <Link href="/resumes" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="glass-panel p-6 text-center rounded-2xl border border-slate-800 space-y-2">
              <FileText className="w-6 h-6 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">No candidate resumes uploaded yet.</p>
              <Link
                href="/resumes/upload"
                className="inline-block text-xs font-semibold text-cyan-400 hover:underline pt-1"
              >
                Upload First Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 4).map((resume) => {
                let parsedSkills: string[] = [];
                try {
                  parsedSkills = JSON.parse(resume.extractedSkills || '[]');
                } catch {
                  parsedSkills = [];
                }

                const isHighMatch = resume.aiMatchScore >= 80;
                const isMediumMatch = resume.aiMatchScore >= 60 && resume.aiMatchScore < 80;

                return (
                  <div
                    key={resume.id}
                    className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {resume.candidateName ? resume.candidateName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">
                            {resume.candidateName}
                          </h4>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                            {resume.job?.title || 'Candidate'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            isHighMatch
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isMediumMatch
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {resume.aiMatchScore}% Match
                        </div>
                      </div>
                    </div>

                    {parsedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {parsedSkills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
