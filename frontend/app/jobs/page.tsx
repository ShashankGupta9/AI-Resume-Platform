'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  Building2,
  MapPin,
  Users,
  Upload,
  ArrowUpRight
} from 'lucide-react';

import { jobApi } from '@/services/jobApi';
import { Job } from '@/types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobApi.getJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const rawSkills = job.requiredSkills || job.required_skills;
    const skillsStr = Array.isArray(rawSkills) ? rawSkills.join(', ') : (rawSkills || '');
    const empType = job.employmentType || job.employment_type || '';

    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      skillsStr.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentFilter === 'All' || job.department === departmentFilter;
    const matchesType = typeFilter === 'All' || empType === typeFilter;

    return matchesSearch && matchesDept && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Job Requisitions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage active hiring posts and review candidate submissions per requisition.
          </p>
        </div>

        <Link
          href="/jobs/create"
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all transform active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Job</span>
        </Link>
      </div>

      {/* Filter & Search Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by title, skills, or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dept:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Data & AI">Data & AI</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-900/60 rounded-3xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Job Postings Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {search || departmentFilter !== 'All'
              ? 'No requisitions matched your search criteria. Try resetting filters.'
              : 'Start by creating your first job posting.'}
          </p>
          <Link
            href="/jobs/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20"
          >
            <PlusCircle className="w-4 h-4" /> Create Requisition
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const rawSkills = job.requiredSkills || job.required_skills;
            const skillList = Array.isArray(rawSkills)
              ? rawSkills
              : rawSkills
              ? rawSkills.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
              : [];
            const empType = job.employmentType || job.employment_type || 'Full-Time';
            const salRange = job.salaryRange || job.salary_range || (job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : 'Competitive');

            return (
              <div
                key={job.id}
                className="glass-panel p-6 rounded-3xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold mb-1">
                        <Building2 className="w-3 h-3 text-cyan-400" />
                        {job.department}
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {job.title}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {job.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-3 text-xs text-slate-300 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span>{empType}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-200">{salRange}</span>
                  </div>

                  {/* Skills tags */}
                  {skillList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skillList.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 rounded-md font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {skillList.length > 4 && (
                        <span className="px-2 py-0.5 text-[10px] text-slate-500 font-medium">
                          +{skillList.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>{job._count?.resumes || 0} Candidates</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/resumes/upload?jobId=${job.id}`}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload CV</span>
                    </Link>
                    <Link
                      href={`/resumes?jobId=${job.id}`}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <span>Candidates</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
