'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import JobForm from '@/components/jobs/JobForm';
import LoadingSkeleton from '@/components/jobs/LoadingSkeleton';
import { useJobDetails, useJobMutations } from '@/hooks/useJobs';
import { JobFormData } from '@/lib/jobValidation';
import { ArrowLeft } from 'lucide-react';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { job, isLoading, error } = useJobDetails(id);
  const { updateJob, isSubmitting } = useJobMutations();

  const handleFormSubmit = async (data: JobFormData) => {
    if (!id) return;
    const updated = await updateJob(id, {
      title: data.title,
      department: data.department,
      employment_type: data.employment_type,
      location: data.location,
      experience_level: data.experience_level,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      description: data.description,
      requirements: data.requirements,
      required_skills: data.required_skills,
      deadline: data.deadline || '2026-12-31',
      status: data.status || 'OPEN',
    });

    if (updated) {
      router.push(`/dashboard/jobs/${id}`);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <LoadingSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-100">Job Requisition Not Found</h2>
          <p className="text-xs text-slate-400">The requisition may have been deleted or moved.</p>
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href={`/dashboard/jobs/${id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Back to Requisition Details</span>
          </Link>
        </div>

        {/* Job Form Component */}
        <JobForm mode="edit" initialData={job} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      </div>
    </DashboardLayout>
  );
}
