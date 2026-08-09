'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
  const { showToast } = useToast();

  const preselectedJobId = searchParams.get('jobId') || '';

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

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    try {
      const jobList = await apiService.getJobs();
      setJobs(jobList || []);
      if (!selectedJobId && jobList && jobList.length > 0) {
        setSelectedJobId(jobList[0].id);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile: File) => {
    const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      showToast('error', 'Unsupported File Format', 'Please select a valid PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (uploadedFile.size > 10 * 1024 * 1024) {
      showToast('error', 'File Size Limit', 'Resume file size cannot exceed 10MB.');
      return;
    }

    setFile(uploadedFile);
    showToast('info', 'File Loaded', `Selected ${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(1)} KB)`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      showToast('error', 'No File Attached', 'Please select a resume file (PDF or DOCX) to upload.');
      return;
    }

    if (!selectedJobId) {
      showToast('error', 'No Job Selected', 'Please select a target job position for this applicant.');
      return;
    }

    setIsUploading(true);
    setUploadSuccessResult(null);

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
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Resume Parser Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Upload & Analyze Candidate Resume
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Upload candidate CVs in PDF or DOCX format. The system automatically extracts skills and computes AI match compatibility.
        </p>
      </div>

      {uploadSuccessResult ? (
        /* Success Analysis Card */
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Resume Analysis Complete!</h2>
            <p className="text-sm text-slate-300">
              Candidate <span className="text-cyan-300 font-semibold">{uploadSuccessResult.candidateName}</span> has been processed.
            </p>
          </div>

          {/* AI Score Badge */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">AI Skill Match Score</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-black rounded-full">
                {uploadSuccessResult.aiMatchScore}% Match
              </span>
            </div>
            <p className="text-xs text-slate-300 text-left leading-relaxed">
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
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Upload Another Resume</span>
            </button>
            <Link
              href="/resumes"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <span>View All Candidates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Upload Form */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Job Requisition Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Target Job Requisition <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select
                  required
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : file
                    ? 'border-indigo-500/60 bg-indigo-950/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
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
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-white">{file.name}</span>
                    <span className="text-xs text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB • Click or drop to replace
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-cyan-400 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Drag and drop candidate resume file here, or{' '}
                        <span className="text-cyan-400 underline">browse computer</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Supports PDF and DOCX files up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Metadata Inputs */}
            <div className="border-t border-slate-800 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Candidate Information (Optional - Auto extracted if left blank)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Candidate Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || !file}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Parsing Resume & Calculating AI Match Score...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Analyze Resume with AI</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function UploadResumePage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading upload engine...</div>}>
      <UploadResumeContent />
    </Suspense>
  );
}
