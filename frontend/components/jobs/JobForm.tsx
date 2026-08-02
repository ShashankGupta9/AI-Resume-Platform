'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema, JobFormData, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, DEPARTMENTS } from '@/lib/jobValidation';
import { Job } from '@/types';
import { Plus, X, ArrowRight, Save, Sparkles, Building, MapPin, DollarSign, Layers } from 'lucide-react';

interface JobFormProps {
  initialData?: Job | null;
  onSubmit: (data: JobFormData) => Promise<void>;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

export default function JobForm({ initialData, onSubmit, isSubmitting = false, mode = 'create' }: JobFormProps) {
  const parseSkills = (job?: Job | null): string[] => {
    if (!job) return ['Python', 'TypeScript', 'React'];
    const s = job.required_skills || job.requiredSkills;
    if (Array.isArray(s)) return s;
    if (typeof s === 'string') {
      try {
        return JSON.parse(s);
      } catch {
        return s.split(',').map((item) => item.trim()).filter(Boolean);
      }
    }
    return ['Python', 'React'];
  };

  const [skills, setSkills] = useState<string[]>(parseSkills(initialData));
  const [skillInput, setSkillInput] = useState<string>('');

  const parseSalMin = (job?: Job | null): number => {
    if (job?.salary_min !== undefined) return job.salary_min;
    return 80000;
  };

  const parseSalMax = (job?: Job | null): number => {
    if (job?.salary_max !== undefined) return job.salary_max;
    return 130000;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: initialData?.title || '',
      department: initialData?.department || 'Engineering',
      employment_type: initialData?.employment_type || initialData?.employmentType || 'Full Time',
      location: initialData?.location || 'Remote (Global)',
      experience_level: initialData?.experience_level || initialData?.experienceRequired || 'Mid-Level (3-5 yrs)',
      salary_min: parseSalMin(initialData),
      salary_max: parseSalMax(initialData),
      description: initialData?.description || '',
      requirements: initialData?.requirements || 'Bachelor degree in CS or equivalent experience.\nDemonstrated proficiency in modern full-stack development.',
      required_skills: skills,
      deadline: initialData?.deadline || '2026-12-31',
      status: (initialData?.status as 'OPEN' | 'CLOSED' | 'DRAFT') || 'OPEN',
    },
  });

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !skills.includes(clean)) {
      const updated = [...skills, clean];
      setSkills(updated);
      setValue('required_skills', updated, { shouldValidate: true });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    setValue('required_skills', updated, { shouldValidate: true });
  };

  const onFormSubmit = async (data: JobFormData) => {
    await onSubmit({ ...data, required_skills: skills });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Form Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{mode === 'create' ? 'Create Job Requisition' : 'Edit Job Requisition'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Provide job details, compensation range, required qualifications, and candidate evaluation skills.
            </p>
          </div>
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full">
            {watch('status')}
          </span>
        </div>

        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            <span>Position Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="Senior Full Stack Software Engineer"
                className={`w-full px-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-rose-500/60 focus:ring-rose-500/50' : 'border-slate-800 focus:ring-indigo-500/50'
                }`}
              />
              {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title.message}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department <span className="text-rose-400">*</span>
              </label>
              <select
                {...register('department')}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900 text-slate-100">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Employment Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Employment Type <span className="text-rose-400">*</span>
              </label>
              <select
                {...register('employment_type')}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-slate-900 text-slate-100">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  {...register('location')}
                  placeholder="Remote / San Francisco, CA"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Experience Level <span className="text-rose-400">*</span>
              </label>
              <select
                {...register('experience_level')}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-slate-900 text-slate-100">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Compensation & Schedule */}
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Compensation & Status</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Min Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Annual Salary ($)
              </label>
              <input
                type="number"
                {...register('salary_min', { valueAsNumber: true })}
                placeholder="80000"
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Max Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Maximum Annual Salary ($)
              </label>
              <input
                type="number"
                {...register('salary_max', { valueAsNumber: true })}
                placeholder="140000"
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              {errors.salary_max && <p className="text-[11px] text-rose-400 mt-1">{errors.salary_max.message}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Requisition Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="OPEN" className="bg-slate-900 text-emerald-300">OPEN (Actively Hiring)</option>
                <option value="CLOSED" className="bg-slate-900 text-rose-300">CLOSED (Position Filled)</option>
                <option value="DRAFT" className="bg-slate-900 text-amber-300">DRAFT (Internal Review)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Job Description & Qualifications */}
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Description & Requirements</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Job Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Provide a overview of role expectations, team mission, key responsibilities, and day-to-day work..."
              className={`w-full px-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.description ? 'border-rose-500/60 focus:ring-rose-500/50' : 'border-slate-800 focus:ring-indigo-500/50'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-400 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Role Requirements & Qualifications <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              {...register('requirements')}
              placeholder="List education requirements, domain expertise, tools, and technical prerequisites..."
              className={`w-full px-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.requirements ? 'border-rose-500/60 focus:ring-rose-500/50' : 'border-slate-800 focus:ring-indigo-500/50'
              }`}
            />
            {errors.requirements && <p className="text-[11px] text-rose-400 mt-1">{errors.requirements.message}</p>}
          </div>

          {/* Skill Tag Builder */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Required AI Match Skills <span className="text-rose-400">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add skill (e.g. Python, React, PostgreSQL)..."
                className="flex-1 px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-full flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            {errors.required_skills && (
              <p className="text-[11px] text-rose-400 mt-1.5 font-medium">
                {errors.required_skills.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : mode === 'create' ? (
              <>
                <span>Publish Requisition</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
