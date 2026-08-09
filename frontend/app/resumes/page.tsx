'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Upload,
  Briefcase,
  Mail,
  Phone,
  Sparkles,
  X,
  Grid,
  List
} from 'lucide-react';

import { apiService } from '@/services/api';
import { Job, Resume } from '@/types';

function ResumesContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const initialJobId = searchParams.get('jobId') || 'All';

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState(initialJobId);
  const [scoreFilter, setScoreFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resumesList, jobsList] = await Promise.all([
        apiService.getResumes(),
        apiService.getJobs()
      ]);
      setResumes(resumesList || []);
      setJobs(jobsList || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the resume for ${name}?`)) return;

    try {
      await apiService.deleteResume(id);
      showToast('success', 'Resume Deleted', `Removed candidate record for ${name}.`);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (selectedResume?.id === id) setSelectedResume(null);
    } catch (err) {
      console.error('Error deleting resume:', err);
      showToast('error', 'Delete Failed', 'Could not delete resume record.');
    }
  };

  const filteredResumes = resumes.filter((r) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      r.candidateName.toLowerCase().includes(query) ||
      r.email.toLowerCase().includes(query) ||
      r.extractedSkills.toLowerCase().includes(query) ||
      (r.job?.title || '').toLowerCase().includes(query);

    const matchesJob = jobFilter === 'All' || r.jobId === jobFilter;

    let matchesScore = true;
    if (scoreFilter === 'High') matchesScore = r.aiMatchScore >= 80;
    if (scoreFilter === 'Medium') matchesScore = r.aiMatchScore >= 50 && r.aiMatchScore < 80;
    if (scoreFilter === 'Low') matchesScore = r.aiMatchScore < 50;

    return matchesSearch && matchesJob && matchesScore;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Candidate Resumes & Applications
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search, filter, and inspect applicant profiles evaluated by the AI match engine.
          </p>
        </div>

        <Link
          href="/resumes/upload"
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all transform active:scale-95 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Candidate Resume</span>
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, email, or skill tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Job Filter */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="All">All Jobs</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          {/* AI Match Filter */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300">
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Match Rates</option>
              <option value="High">Top Match (&gt;80%)</option>
              <option value="Medium">Medium Match (50-79%)</option>
              <option value="Low">Low Match (&lt;50%)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 text-slate-400">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Resume Content View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-slate-900/60 rounded-3xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Candidates Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchQuery || jobFilter !== 'All'
              ? 'No applicant resumes matched your search parameters.'
              : 'No candidate resumes have been submitted yet.'}
          </p>
          <Link
            href="/resumes/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
          >
            <Upload className="w-4 h-4" /> Upload First Resume
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResumes.map((r) => {
            let skillList: string[] = [];
            try {
              skillList = JSON.parse(r.extractedSkills || '[]');
            } catch {
              skillList = [];
            }

            const isHigh = r.aiMatchScore >= 80;
            const isMedium = r.aiMatchScore >= 50 && r.aiMatchScore < 80;

            return (
              <div
                key={r.id}
                className="glass-panel p-5 rounded-3xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                        {r.candidateName ? r.candidateName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                          {r.candidateName}
                        </h3>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-cyan-400" />
                          {r.job?.title || 'General Applicant'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                        isHigh
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isMedium
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {r.aiMatchScore}% Match
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{r.email}</span>
                    </div>
                    {r.phone && r.phone !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{r.phone}</span>
                      </div>
                    )}
                  </div>

                  {skillList.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {skillList.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {new Date(r.uploadDate).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedResume(r)}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                    <button
                      onClick={() => handleDeleteResume(r.id, r.candidateName)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete Candidate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Applied Position</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4 text-center">AI Match Score</th>
                  <th className="p-4">Upload Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {filteredResumes.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                        {r.candidateName ? r.candidateName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <span>{r.candidateName}</span>
                    </td>
                    <td className="p-4 text-slate-300">{r.job?.title || 'General'}</td>
                    <td className="p-4 text-xs text-slate-400">
                      <div>{r.email}</div>
                      <div>{r.phone}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black rounded-full">
                        {r.aiMatchScore}%
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(r.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedResume(r)}
                          className="p-1.5 text-indigo-300 hover:bg-indigo-600/20 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResume(r.id, r.candidateName)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Resume Preview & AI Match Breakdown Modal */}
      {selectedResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedResume(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                {selectedResume.candidateName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">{selectedResume.candidateName}</h2>
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Applied Position: {selectedResume.job?.title}</span>
                </div>
              </div>
            </div>

            {/* AI Score Banner */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">AI Skill Match Rating</span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Calculated against position target skills
                </p>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-300 font-black text-xl rounded-2xl">
                {selectedResume.aiMatchScore}% Match
              </div>
            </div>

            {/* AI Summary */}
            {selectedResume.aiSummary && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Analysis & Recommendation</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  {selectedResume.aiSummary}
                </p>
              </div>
            )}

            {/* Extracted Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Detected Core Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(() => {
                  try {
                    const skills = JSON.parse(selectedResume.extractedSkills || '[]');
                    return skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 text-xs font-medium rounded-lg"
                      >
                        {skill}
                      </span>
                    ));
                  } catch {
                    return <span className="text-xs text-slate-500">No skills parsed.</span>;
                  }
                })()}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block">Email Address</span>
                <span className="font-semibold text-slate-200">{selectedResume.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Phone Number</span>
                <span className="font-semibold text-slate-200">{selectedResume.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Resume File Name</span>
                <span className="font-semibold text-slate-200">{selectedResume.fileName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Upload Timestamp</span>
                <span className="font-semibold text-slate-200">
                  {new Date(selectedResume.uploadDate).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedResume(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close Preview
              </button>
              <a
                href={selectedResume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume File</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading candidates database...</div>}>
      <ResumesContent />
    </Suspense>
  );
}
