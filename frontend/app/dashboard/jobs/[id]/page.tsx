'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DeleteConfirmationDialog from '@/components/jobs/DeleteConfirmationDialog';
import { useJobDetails, useJobMutations } from '@/hooks/useJobs';
import {
  ArrowLeft,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Edit3,
  Trash2,
  Upload,
  Calendar,
  Sparkles,
  Layers,
  FileCheck,
} from 'lucide-react';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { job, isLoading, error } = useJobDetails(id);
  const { deleteJob } = useJobMutations();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!job) return;
    setIsDeleting(true);
    try {
      await deleteJob(job.id);
      router.push('/dashboard/jobs');
    } catch {
      // Error handled by hook toast
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-slate-800 rounded-md" />
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="h-8 w-64 bg-slate-800 rounded-lg" />
            <div className="h-4 w-48 bg-slate-800/60 rounded-md" />
            <div className="h-24 w-full bg-slate-800/40 rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-100">Job Requisition Not Found</h2>
          <p className="text-xs text-slate-400">The requisition may have been removed or you do not have permission.</p>
          <Link
            href="/dashboard/jobs"
            className="inline-block px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
          >
            Back to All Requisitions
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const empType = job.employment_type || job.employmentType || 'Full Time';
  const expLevel = job.experience_level || job.experienceRequired || '1-3 yrs';
  const salRange = job.salary_range || job.salaryRange || 'Competitive';
  const appCount = job.applicant_count ?? job.applicantCount ?? job._count?.resumes ?? 0;

  const skillsList: string[] = Array.isArray(job.required_skills)
    ? job.required_skills
    : Array.isArray(job.requiredSkills)
    ? job.requiredSkills
    : typeof job.required_skills === 'string'
    ? JSON.parse(job.required_skills || '[]')
    : [];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Actions Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Requisitions</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/resumes/upload?job_id=${job.id}`}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Resume</span>
            </Link>

            <Link
              href={`/dashboard/jobs/${job.id}/edit`}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Main Job Hero Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{job.department}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-indigo-400" />
                  {empType}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  {expLevel}
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  {salRange}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
                ● {job.status}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Deadline: {job.deadline || '2026-12-31'}
              </span>
            </div>
          </div>

          {/* Candidate Applications Banner */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Candidate Pipeline Status</h4>
                <p className="text-[11px] text-slate-400">{appCount} applications submitted & AI evaluated</p>
              </div>
            </div>

            <Link
              href={`/resumes?job_id=${job.id}`}
              className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-semibold rounded-xl shadow"
            >
              Evaluate Candidates
            </Link>
          </div>

          {/* Job Description */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Position Overview</span>
            </h3>
            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Requirements & Qualifications */}
          {job.requirements && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                <span>Role Qualifications & Requirements</span>
              </h3>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {job.requirements}
              </p>
            </div>
          )}

          {/* AI Match Required Skills */}
          {skillsList.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Required AI Match Skills</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationDialog
          isOpen={showDeleteModal}
          jobTitle={job.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}
