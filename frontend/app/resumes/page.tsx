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
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight uppercase">
            Candidate Resumes & Applications
          </h1>
          <p className="text-xs text-[#BFBFBF] mt-1">
            Search, filter, and inspect applicant profiles evaluated by the AI match engine.
          </p>
        </div>

        <Link
          href="/resumes/upload"
          className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Candidate Resume</span>
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#FF6803]/20 bg-[#120C0A]/85 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#BFBFBF]">
            <Search className="w-4 h-4 text-[#FF6803]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, email, or skill tags..."
            className="w-full pl-10 pr-4 py-2 bg-[#1A110E] border border-white/10 rounded-full text-xs text-white placeholder-[#BFBFBF]/60 focus:outline-none focus:ring-2 focus:ring-[#FF6803]/50 focus:border-[#FF6803]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Job Filter */}
          <div className="flex items-center gap-1.5 bg-[#1A110E] border border-white/10 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#BFBFBF]">
            <Filter className="w-3.5 h-3.5 text-[#FF6803]" />
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="All" className="bg-[#1A110E]">All Jobs</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id} className="bg-[#1A110E]">
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          {/* AI Match Filter */}
          <div className="flex items-center gap-1.5 bg-[#1A110E] border border-white/10 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#BFBFBF]">
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#1A110E]">All Match Rates</option>
              <option value="High" className="bg-[#1A110E]">Top Match (&gt;80%)</option>
              <option value="Medium" className="bg-[#1A110E]">Medium Match (50-79%)</option>
              <option value="Low" className="bg-[#1A110E]">Low Match (&lt;50%)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-[#1A110E] border border-white/10 rounded-full p-1 text-[#BFBFBF]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'grid' ? 'bg-[#FF6803] text-white' : 'hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'table' ? 'bg-[#FF6803] text-white' : 'hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Resume Content View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-[#120C0A]/60 rounded-3xl animate-pulse border border-[#FF6803]/15" />
          ))}
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-[#FF6803]/20 space-y-4 bg-[#120C0A]/85">
          <Users className="w-10 h-10 text-[#FF6803]/60 mx-auto" />
          <h3 className="text-base font-display font-bold text-white">No Candidates Found</h3>
          <p className="text-xs text-[#BFBFBF] max-w-md mx-auto">
            {searchQuery || jobFilter !== 'All'
              ? 'No applicant resumes matched your search parameters.'
              : 'No candidate resumes have been submitted yet.'}
          </p>
          <Link
            href="/resumes/upload"
            className="btn-primary px-5 py-2.5 text-xs inline-flex items-center gap-2"
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
                className="glass-panel glass-panel-hover p-5 rounded-3xl border border-[#FF6803]/20 bg-[#120C0A]/85 flex flex-col justify-between space-y-4 group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6803] to-[#AE3A02] flex items-center justify-center text-white font-bold text-sm shadow">
                        {r.candidateName ? r.candidateName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-white group-hover:text-[#FF6803] transition-colors">
                          {r.candidateName}
                        </h3>
                        <span className="text-xs text-[#BFBFBF] flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-[#FF6803]" />
                          {r.job?.title || 'General Applicant'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                        isHigh
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isMedium
                          ? 'bg-[#FF6803]/20 text-[#FF6803] border border-[#FF6803]/30'
                          : 'bg-white/10 text-[#BFBFBF] border border-white/20'
                      }`}
                    >
                      {r.aiMatchScore}% Match
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-[#BFBFBF]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#FF6803]/80" />
                      <span className="truncate">{r.email}</span>
                    </div>
                    {r.phone && r.phone !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#FF6803]/80" />
                        <span>{r.phone}</span>
                      </div>
                    )}
                  </div>

                  {skillList.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {skillList.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#1A110E] border border-white/10 text-[10px] text-white rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#BFBFBF]">
                    {new Date(r.uploadDate).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedResume(r)}
                      className="px-3 py-1.5 bg-[#FF6803]/15 hover:bg-[#FF6803]/30 text-[#FF6803] border border-[#FF6803]/30 text-xs font-semibold rounded-full flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                    <button
                      onClick={() => handleDeleteResume(r.id, r.candidateName)}
                      className="p-1.5 text-[#BFBFBF] hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
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
        <div className="glass-panel rounded-3xl border border-[#FF6803]/20 bg-[#120C0A]/85 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#1A110E] text-[11px] font-bold text-[#BFBFBF] uppercase tracking-wider">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Applied Position</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4 text-center">AI Match Score</th>
                  <th className="p-4">Upload Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-[#BFBFBF]">
                {filteredResumes.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6803] to-[#AE3A02] flex items-center justify-center text-white font-bold text-xs">
                        {r.candidateName ? r.candidateName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <span className="font-display">{r.candidateName}</span>
                    </td>
                    <td className="p-4 text-white">{r.job?.title || 'General'}</td>
                    <td className="p-4 text-xs text-[#BFBFBF]">
                      <div>{r.email}</div>
                      <div>{r.phone}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black rounded-full">
                        {r.aiMatchScore}%
                      </span>
                    </td>
                    <td className="p-4 text-xs text-[#BFBFBF]">
                      {new Date(r.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedResume(r)}
                          className="p-1.5 text-[#FF6803] hover:bg-[#FF6803]/20 rounded-full"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResume(r.id, r.candidateName)}
                          className="p-1.5 text-[#BFBFBF] hover:text-rose-400 hover:bg-rose-500/10 rounded-full"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0501]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-[#FF6803]/30 bg-[#120C0A] space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedResume(null)}
              className="absolute top-6 right-6 p-2 text-[#BFBFBF] hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF6803] to-[#AE3A02] flex items-center justify-center text-white text-xl font-black shadow-lg">
                {selectedResume.candidateName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-bold text-white">{selectedResume.candidateName}</h2>
                <div className="flex items-center gap-2 text-xs text-[#FF6803] font-medium">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Applied Position: {selectedResume.job?.title}</span>
                </div>
              </div>
            </div>

            {/* AI Score Banner */}
            <div className="p-4 bg-[#1A110E] border border-white/10 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#BFBFBF] uppercase tracking-wider">AI Skill Match Rating</span>
                <p className="text-xs text-[#BFBFBF] mt-0.5">
                  Calculated against position target skills
                </p>
              </div>
              <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-black text-xl rounded-2xl">
                {selectedResume.aiMatchScore}% Match
              </div>
            </div>

            {/* AI Summary */}
            {selectedResume.aiSummary && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Sparkles className="w-4 h-4 text-[#FF6803]" />
                  <span>AI Analysis & Recommendation</span>
                </h4>
                <p className="text-xs text-[#BFBFBF] leading-relaxed bg-[#1A110E]/80 p-4 rounded-xl border border-white/10">
                  {selectedResume.aiSummary}
                </p>
              </div>
            )}

            {/* Extracted Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                Detected Core Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(() => {
                  try {
                    const skills = JSON.parse(selectedResume.extractedSkills || '[]');
                    return skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#FF6803]/15 border border-[#FF6803]/30 text-white text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ));
                  } catch {
                    return <span className="text-xs text-[#BFBFBF]">No skills parsed.</span>;
                  }
                })()}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs text-[#BFBFBF]">
              <div>
                <span className="text-[#BFBFBF]/70 block">Email Address</span>
                <span className="font-semibold text-white">{selectedResume.email}</span>
              </div>
              <div>
                <span className="text-[#BFBFBF]/70 block">Phone Number</span>
                <span className="font-semibold text-white">{selectedResume.phone}</span>
              </div>
              <div>
                <span className="text-[#BFBFBF]/70 block">Resume File Name</span>
                <span className="font-semibold text-white">{selectedResume.fileName}</span>
              </div>
              <div>
                <span className="text-[#BFBFBF]/70 block">Upload Timestamp</span>
                <span className="font-semibold text-white">
                  {new Date(selectedResume.uploadDate).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setSelectedResume(null)}
                className="btn-secondary px-4 py-2 text-xs"
              >
                Close Preview
              </button>
              <a
                href={selectedResume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="btn-primary px-5 py-2 text-xs flex items-center gap-2"
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
    <Suspense fallback={<div className="text-center py-12 text-[#BFBFBF]">Loading candidates database...</div>}>
      <ResumesContent />
    </Suspense>
  );
}
