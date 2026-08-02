'use client';

import { useState, useEffect, useCallback } from 'react';
import { jobApi, JobStats, JobListResult } from '@/services/jobApi';
import { Job, JobCreateInput } from '@/types';
import { useToast } from '@/hooks/useToast';

export function useJobStats() {
  const [stats, setStats] = useState<JobStats>({
    total_jobs: 0,
    open_jobs: 0,
    closed_jobs: 0,
    total_applications: 0,
    recent_activity: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobApi.getStats();
      setStats(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard metrics';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

export function useJobs(initialParams?: { search?: string; status?: string; page?: number; limit?: number }) {
  const [result, setResult] = useState<JobListResult>({
    jobs: [],
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>(initialParams?.search || '');
  const [status, setStatus] = useState<string>(initialParams?.status || 'ALL');
  const [page, setPage] = useState<number>(initialParams?.page || 1);
  const [limit] = useState<number>(initialParams?.limit || 10);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobApi.getJobs({ search, status, page, limit });
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch jobs';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [search, status, page, limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs: result.jobs,
    total: result.total,
    page: result.page,
    pages: result.pages,
    limit: result.limit,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    setPage,
    refetch: fetchJobs,
  };
}

export function useJobDetails(id: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobApi.getJobById(id);
      setJob(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch job details';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return { job, isLoading, error, refetch: fetchJob };
}

export function useJobMutations() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createJob = async (data: JobCreateInput) => {
    setIsSubmitting(true);
    try {
      const newJob = await jobApi.createJob(data);
      showToast('success', 'Job Requisition Created', `"${newJob.title}" has been published.`);
      return newJob;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create job';
      showToast('error', 'Error Creating Job', msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateJob = async (id: string, data: Partial<JobCreateInput>) => {
    setIsSubmitting(true);
    try {
      const updated = await jobApi.updateJob(id, data);
      showToast('success', 'Job Requisition Updated', `"${updated.title}" changes saved.`);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update job';
      showToast('error', 'Error Updating Job', msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteJob = async (id: string) => {
    setIsSubmitting(true);
    try {
      await jobApi.deleteJob(id);
      showToast('success', 'Job Requisition Deleted', 'Job deleted from system.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete job';
      showToast('error', 'Error Deleting Job', msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createJob, updateJob, deleteJob, isSubmitting };
}
