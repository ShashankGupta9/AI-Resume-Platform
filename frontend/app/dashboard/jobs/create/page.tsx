'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import JobForm from '@/components/jobs/JobForm';
import { useJobMutations } from '@/hooks/useJobs';
import { JobFormData } from '@/lib/jobValidation';
import { ArrowLeft } from 'lucide-react';

export default function CreateJobPage() {
  const router = useRouter();
  const { createJob, isSubmitting } = useJobMutations();

  const handleFormSubmit = async (data: JobFormData) => {
    const created = await createJob({
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

    if (created) {
      router.push('/dashboard/jobs');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Requisitions</span>
          </Link>
        </div>

        {/* Job Form Component */}
        <JobForm mode="create" onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      </div>
    </DashboardLayout>
  );
}
