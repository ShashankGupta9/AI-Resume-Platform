'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCards from '@/components/dashboard/DashboardCards';
import JobTable from '@/components/jobs/JobTable';
import DeleteConfirmationDialog from '@/components/jobs/DeleteConfirmationDialog';
import LoadingSkeleton from '@/components/jobs/LoadingSkeleton';
import EmptyState from '@/components/jobs/EmptyState';
import { useJobStats, useJobs, useJobMutations } from '@/hooks/useJobs';
import { Job } from '@/types';
import { Sparkles, PlusCircle, ArrowRight, Briefcase } from 'lucide-react';

export default function DashboardPage() {
  const { stats, isLoading: statsLoading } = useJobStats();
  const { jobs, isLoading: jobsLoading, refetch } = useJobs({ limit: 5 });
  const { deleteJob } = useJobMutations();

  const [deletingJob, setDeletingJob] = React.useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteConfirm = async () => {
    if (!deletingJob) return;
    setIsDeleting(true);
    try {
      await deleteJob(deletingJob.id);
      setDeletingJob(null);
      refetch();
    } catch {
      // Error handled by hook toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Evaluation Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recruiter Control Center
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Monitor active requisitions, evaluate candidate applications with AI match scoring, and post new open requisitions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10">
            <Link
              href="/dashboard/jobs/create"
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Requisition</span>
            </Link>
          </div>
        </div>

        {/* Analytics Summary Metric Cards */}
        <DashboardCards stats={stats} isLoading={statsLoading} />

        {/* Recent Job Requisitions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Recent Requisitions</span>
              </h2>
              <p className="text-xs text-slate-400">Latest active and draft job requisitions in your account</p>
            </div>

            <Link
              href="/dashboard/jobs"
              className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All ({stats.total_jobs})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {jobsLoading ? (
            <LoadingSkeleton />
          ) : jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <JobTable jobs={jobs} onDeleteClick={(job) => setDeletingJob(job)} />
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationDialog
          isOpen={!!deletingJob}
          jobTitle={deletingJob?.title || ''}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingJob(null)}
          isDeleting={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}
