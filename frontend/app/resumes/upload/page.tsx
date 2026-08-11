'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import {
  Upload,
  FileText,
  Briefcase,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

import { apiService } from '@/services/api';
import { Job } from '@/types';

function UploadResumeContent() {
  const searchParams = useSearchParams();
  const preselectedJobId = searchParams.get('job_id') || '';

  const { showToast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(preselectedJobId);
  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessResult, setUploadSuccessResult] = useState<{
    candidateName: string;
    aiMatchScore: number;
    aiSummary?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const jobList = await apiService.getJobs();
      setJobs(jobList || []);
      if (!selectedJobId && jobList && jobList.length > 0) {
        setSelectedJobId(jobList[0].id);
      }
    } catch (err) {
      console.error('Error fetching jobs for upload dropdown:', err);
    }
  }, [selectedJobId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      validateAndSetFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      validateAndSetFile(dropped);
    }
  };

  const validateAndSetFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      showToast('error', 'Invalid File Type', 'Please upload a PDF or DOCX resume document.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      showToast('error', 'File Too Large', 'Maximum file size allowed is 10MB.');
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJobId) {
      showToast('error', 'Job Required', 'Please select a target job requisition.');
      return;
    }

    if (!file) {
      showToast('error', 'File Required', 'Please attach a candidate resume document.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobId', selectedJobId);
      formData.append('candidateName', candidateName);
      formData.append('email', email);
      formData.append('phone', phone);

      const result = await apiService.uploadResume(formData);

      showToast('success', 'Resume Analyzed!', `AI Match Score: ${result.resume.aiMatchScore}%`);
      setUploadSuccessResult(result.resume);
    } catch (err: unknown) {
      console.error('Error uploading resume:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during file upload.';
      showToast('error', 'Upload Failed', msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="pill-badge inline-flex">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6803]" />
          <span>AI RESUME PARSER ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight uppercase">
          Upload & Analyze Candidate Resume
        </h1>
        <p className="text-sm text-[#BFBFBF] max-w-lg mx-auto">
          Upload candidate CVs in PDF or DOCX format. The system automatically extracts skills and computes AI match compatibility.
        </p>
      </div>

      {uploadSuccessResult ? (
        /* Success Analysis Card */
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300 bg-[#120C0A]/90 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">Resume Analysis Complete!</h2>
            <p className="text-sm text-[#BFBFBF]">
              Candidate <span className="text-[#FF6803] font-semibold">{uploadSuccessResult.candidateName}</span> has been evaluated.
            </p>
          </div>

          {/* AI Score Badge */}
          <div className="p-6 bg-[#1A110E] border border-white/10 rounded-2xl max-w-md mx-auto space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#BFBFBF] uppercase tracking-wider">AI Skill Match Score</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-black rounded-full">
                {uploadSuccessResult.aiMatchScore}% Match
              </span>
            </div>
            <p className="text-xs text-[#BFBFBF] text-left leading-relaxed">
              {uploadSuccessResult.aiSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setUploadSuccessResult(null);
                setFile(null);
                setCandidateName('');
                setEmail('');
                setPhone('');
              }}
              className="btn-secondary px-5 py-2.5 text-xs flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-[#FF6803]" />
              <span>Upload Another Resume</span>
            </button>
            <Link
              href="/resumes"
              className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
            >
              <span>View All Candidates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Upload Form */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#FF6803]/20 bg-[#120C0A]/85 space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Job Requisition Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#BFBFBF] mb-1.5">
                Select Target Job Requisition <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#BFBFBF]">
                  <Briefcase className="w-4 h-4 text-[#FF6803]" />
                </div>
                <select
                  required
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A110E] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF6803]/50 focus:border-[#FF6803] transition-all"
                >
                  {jobs.length === 0 ? (
                    <option value="">No active jobs found (Create a job first)</option>
                  ) : (
                    jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} — {job.department}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Drag & Drop File Upload Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#BFBFBF] mb-1.5">
                Resume Document (PDF or DOCX, max 10MB) <span className="text-rose-400">*</span>
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? 'border-[#FF6803] bg-[#FF6803]/10'
                    : file
                    ? 'border-[#FF6803]/60 bg-[#FF6803]/5'
                    : 'border-white/10 hover:border-[#FF6803]/40 bg-[#1A110E]/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF6803]/20 text-[#FF6803] flex items-center justify-center border border-[#FF6803]/30">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-white">{file.name}</span>
                    <span className="text-xs text-[#BFBFBF]">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB — Click to change file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#FF6803] flex items-center justify-center border border-white/10">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Drag & Drop resume file here, or <span className="text-[#FF6803] hover:underline">Browse</span>
                    </p>
                    <p className="text-xs text-[#BFBFBF]">Supports PDF & DOCX formats up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#BFBFBF] mb-1">Candidate Name (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#BFBFBF]">
                    <User className="w-3.5 h-3.5 text-[#FF6803]" />
                  </div>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Auto-extracted if blank"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#1A110E] border border-white/10 rounded-xl text-xs text-white placeholder-[#BFBFBF]/50 focus:outline-none focus:ring-1 focus:ring-[#FF6803]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BFBFBF] mb-1">Email (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#BFBFBF]">
                    <Mail className="w-3.5 h-3.5 text-[#FF6803]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Auto-extracted if blank"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#1A110E] border border-white/10 rounded-xl text-xs text-white placeholder-[#BFBFBF]/50 focus:outline-none focus:ring-1 focus:ring-[#FF6803]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BFBFBF] mb-1">Phone (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#BFBFBF]">
                    <Phone className="w-3.5 h-3.5 text-[#FF6803]" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Auto-extracted if blank"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#1A110E] border border-white/10 rounded-xl text-xs text-white placeholder-[#BFBFBF]/50 focus:outline-none focus:ring-1 focus:ring-[#FF6803]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex justify-end gap-3">
              <Link
                href="/resumes"
                className="btn-secondary px-5 py-2.5 text-xs font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Analyze & Process Resume</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function UploadResumePage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[#BFBFBF]">Loading Resume Parser...</div>}>
      <UploadResumeContent />
    </Suspense>
  );
}
