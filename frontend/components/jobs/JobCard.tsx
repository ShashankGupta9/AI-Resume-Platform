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
    return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">DRAFT</span>;
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{job.department}</span>
            <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              <Link href={`/dashboard/jobs/${job.id}`}>{job.title}</Link>
            </h3>
          </div>
          {getStatusBadge(job.status)}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            {empType}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            {salRange}
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{job.description}</p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <Link
          href={`/resumes?job_id=${job.id}`}
          className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5 hover:underline"
        >
          <Users className="w-3.5 h-3.5" />
          <span>{appCount} Candidates</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/jobs/${job.id}`}
            className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-slate-800"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            className="p-1.5 text-slate-400 hover:text-indigo-300 rounded-lg hover:bg-slate-800"
            title="Edit Requisition"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDeleteClick(job)}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
            title="Delete Requisition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
