'use client';

import React from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { Building, MapPin, Eye, Edit3, Trash2, Users } from 'lucide-react';

interface JobTableProps {
  jobs: Job[];
  onDeleteClick: (job: Job) => void;
}

export default function JobTable({ jobs, onDeleteClick }: JobTableProps) {
  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'OPEN' || s === 'ACTIVE') {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          ● OPEN
        </span>
      );
    }
    if (s === 'CLOSED') {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
          ● CLOSED
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
        ● DRAFT
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
          <tr>
            <th className="py-3.5 px-4">Job Title & Requisition</th>
            <th className="py-3.5 px-4">Department</th>
            <th className="py-3.5 px-4">Location</th>
            <th className="py-3.5 px-4">Employment Type</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Applications</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {jobs.map((job) => {
            const empType = job.employment_type || job.employmentType || 'Full-Time';
            const expLevel = job.experience_level || job.experienceRequired || '1-3 yrs';
            const appCount = job.applicant_count ?? job.applicantCount ?? job._count?.resumes ?? 0;

            return (
              <tr key={job.id} className="hover:bg-slate-900/50 transition-colors group">
                <td className="py-4 px-4 font-bold text-white">
                  <Link href={`/dashboard/jobs/${job.id}`} className="hover:text-cyan-400 transition-colors block">
                    {job.title}
                  </Link>
                  <span className="text-[10px] font-normal text-slate-400">{expLevel}</span>
                </td>

                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-slate-300 font-medium">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    {job.department}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {job.location}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                    {empType}
                  </span>
                </td>

                <td className="py-4 px-4">{getStatusBadge(job.status)}</td>

                <td className="py-4 px-4">
                  <Link
                    href={`/resumes?job_id=${job.id}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 font-semibold transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{appCount} Candidates</span>
                  </Link>
                </td>

                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/dashboard/jobs/${job.id}/edit`}
                      className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Requisition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => onDeleteClick(job)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Requisition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
