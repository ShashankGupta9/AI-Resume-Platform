'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SearchBar from '@/components/jobs/SearchBar';
import FilterPanel from '@/components/jobs/FilterPanel';
import Pagination from '@/components/jobs/Pagination';
import JobTable from '@/components/jobs/JobTable';
import JobCard from '@/components/jobs/JobCard';
import DeleteConfirmationDialog from '@/components/jobs/DeleteConfirmationDialog';
import LoadingSkeleton from '@/components/jobs/LoadingSkeleton';
import EmptyState from '@/components/jobs/EmptyState';
import { useJobs, useJobMutations } from '@/hooks/useJobs';
import { Job } from '@/types';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';

export default function JobsPage() {
  const {
    jobs,
    total,
    page,
    pages,
    limit,
    isLoading,
    search,
    setSearch,
    status,
    setStatus,
    setPage,
    refetch,
  } = useJobs();

  const { deleteJob } = useJobMutations();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Job Requisitions</h1>
            <p className="text-xs text-slate-400">
              Manage your company&apos;s open positions, hiring pipelines, and applicant specifications.
            </p>
          </div>

          <Link
            href="/dashboard/jobs/create"
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Requisition</span>
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} />

          <div className="flex items-center gap-3">
            <FilterPanel currentStatus={status} onStatusChange={(st) => { setStatus(st); setPage(1); }} />

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No Matching Jobs Found"
            description="Try adjusting your search keywords or status filter to locate requisitions."
          />
        ) : viewMode === 'table' ? (
          <JobTable jobs={jobs} onDeleteClick={(job) => setDeletingJob(job)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onDeleteClick={(j) => setDeletingJob(j)} />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        <Pagination page={page} pages={pages} total={total} limit={limit} onPageChange={(p) => setPage(p)} />

        {/* Delete Modal */}
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
