'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { Briefcase, Building2, MapPin, DollarSign, Calendar, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

import { jobApi } from '@/services/jobApi';

export default function CreateJobPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Remote / US');
  const [employmentType, setEmploymentType] = useState('Full-Time');
  const [experienceRequired, setExperienceRequired] = useState('3-5 years');
  const [salaryRange, setSalaryRange] = useState('$130,000 - $160,000');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('React, Next.js, Node.js, TypeScript, PostgreSQL, Tailwind CSS');
  const [deadline, setDeadline] = useState('2026-09-30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !department || !description || !requiredSkills) {
      showToast('error', 'Validation Error', 'Please complete all required job details.');
      return;
    }

    setIsSubmitting(true);
    try {
      await jobApi.createJob({
        title,
        department,
        location,
        employment_type: employmentType,
        experience_level: experienceRequired,
        salary_min: 130000,
        salary_max: 160000,
        salaryRange,
        description,
        requirements: description,
        required_skills: requiredSkills,
        deadline,
      });

      showToast('success', 'Job Published!', 'New job requisition has been posted successfully.');
      router.push('/jobs');
    } catch (err: unknown) {
      console.error('Error creating job:', err);
      const msg = err instanceof Error ? err.message : 'Could not publish job posting.';
      showToast('error', 'Job Creation Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Listings</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Requisition Builder</span>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 relative overflow-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Job Requisition
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Define requirements, skills, and parameters for candidate resume match scoring.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Title & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Job Title <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Architect"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Department <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Location, Type, Experience */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote / New York"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Experience Required
              </label>
              <input
                type="text"
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(e.target.value)}
                placeholder="e.g. 3-5 years"
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Salary & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Salary Range
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. $120,000 - $150,000"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Application Deadline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Required Skills Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Required Technical & Domain Skills (Comma Separated) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. React, Next.js, TypeScript, PostgreSQL, System Design"
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              These skill tags are used directly by the AI Match Engine to evaluate uploaded candidate resumes.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Job Description & Responsibilities <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe core duties, ideal candidate profile, day-to-day responsibilities, and team culture..."
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end gap-3">
            <Link
              href="/jobs"
              className="px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Job Posting</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
