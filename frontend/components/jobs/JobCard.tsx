'use client';

import React from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { Building, MapPin, DollarSign, Users, Eye, Edit3, Trash2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onDeleteClick: (job: Job) => void;
}

export default function JobCard({ job, onDeleteClick }: JobCardProps) {
  const empType = job.employment_type || job.employmentType || 'Full-Time';
  const salRange = job.salary_range || job.salaryRange || 'Competitive';
  const appCount = job.applicant_count ?? job.applicantCount ?? job._count?.resumes ?? 0;

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'OPEN' || s === 'ACTIVE') {
      return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">OPEN</span>;
    }
    if (s === 'CLOSED') {
      return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">CLOSED</span>;
    }
    return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#FF6803]/10 border border-[#FF6803]/20 text-[#FF6803]">DRAFT</span>;
  };

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-[#FF6803]/20 bg-[#120C0A]/85 flex flex-col justify-between space-y-4 group shadow-lg">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#FF6803] uppercase tracking-wider">{job.department}</span>
            <h3 className="text-base font-display font-extrabold text-white group-hover:text-[#FF6803] transition-colors">
              <Link href={`/dashboard/jobs/${job.id}`}>{job.title}</Link>
            </h3>
          </div>
          {getStatusBadge(job.status)}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[#BFBFBF]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#FF6803]" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-[#BFBFBF]" />
            {empType}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            {salRange}
          </span>
        </div>

        <p className="text-xs text-[#BFBFBF] line-clamp-2 leading-relaxed">{job.description}</p>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
        <Link
          href={`/resumes?job_id=${job.id}`}
          className="text-xs text-[#FF6803] font-semibold flex items-center gap-1.5 hover:underline"
        >
          <Users className="w-3.5 h-3.5" />
          <span>{appCount} Candidates</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/jobs/${job.id}`}
            className="p-1.5 text-[#BFBFBF] hover:text-white rounded-lg hover:bg-white/5"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            className="p-1.5 text-[#BFBFBF] hover:text-[#FF6803] rounded-lg hover:bg-white/5"
            title="Edit Requisition"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDeleteClick(job)}
            className="p-1.5 text-[#BFBFBF] hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
            title="Delete Requisition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
