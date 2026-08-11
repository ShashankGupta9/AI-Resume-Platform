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
      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#FF6803]/10 border border-[#FF6803]/20 text-[#FF6803]">
        ● DRAFT
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#FF6803]/20 bg-[#120C0A]/85 glass-panel">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-[#1A110E] border-b border-white/10 text-[#BFBFBF] font-semibold uppercase tracking-wider">
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
        <tbody className="divide-y divide-white/5 text-[#BFBFBF]">
          {jobs.map((job) => {
            const empType = job.employment_type || job.employmentType || 'Full-Time';
            const expLevel = job.experience_level || job.experienceRequired || '1-3 yrs';
            const appCount = job.applicant_count ?? job.applicantCount ?? job._count?.resumes ?? 0;

            return (
              <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 px-4 font-bold text-white">
                  <Link href={`/dashboard/jobs/${job.id}`} className="hover:text-[#FF6803] transition-colors block font-display">
                    {job.title}
                  </Link>
                  <span className="text-[10px] font-normal text-[#BFBFBF]">{expLevel}</span>
                </td>

                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-white font-medium">
                    <Building className="w-3.5 h-3.5 text-[#FF6803]" />
                    {job.department}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-[#BFBFBF]">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6803]" />
                    {job.location}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-[#1A110E] border border-white/10 text-white">
                    {empType}
                  </span>
                </td>

                <td className="py-4 px-4">{getStatusBadge(job.status)}</td>

                <td className="py-4 px-4">
                  <Link
                    href={`/resumes?job_id=${job.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6803]/10 hover:bg-[#FF6803]/20 border border-[#FF6803]/20 text-[#FF6803] font-semibold transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{appCount} Candidates</span>
                  </Link>
                </td>

                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="p-1.5 text-[#BFBFBF] hover:text-white hover:bg-white/5 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/dashboard/jobs/${job.id}/edit`}
                      className="p-1.5 text-[#BFBFBF] hover:text-[#FF6803] hover:bg-white/5 rounded-full transition-colors"
                      title="Edit Requisition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => onDeleteClick(job)}
                      className="p-1.5 text-[#BFBFBF] hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
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
