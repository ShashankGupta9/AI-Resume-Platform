import { Job, JobCreateInput } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface JobStats {
  total_jobs: number;
  open_jobs: number;
  closed_jobs: number;
  total_applications: number;
  recent_activity: Array<{
    id: string;
    candidate_name: string;
    job_id: string;
    match_score: number;
    status: string;
    time: string;
  }>;
}

export interface JobListResult {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

class JobApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async getStats(): Promise<JobStats> {
    const res = await fetch(`${API_BASE_URL}/api/jobs/stats`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      // Fallback mock stats for local preview
      return {
        total_jobs: 0,
        open_jobs: 0,
        closed_jobs: 0,
        total_applications: 0,
        recent_activity: [],
      };
    }
    return res.json();
  }

  async getJobs(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<JobListResult> {
    const url = new URL(`${API_BASE_URL}/api/jobs`);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.status && params.status !== 'ALL') url.searchParams.append('status', params.status);
    if (params?.page) url.searchParams.append('page', params.page.toString());
    if (params?.limit) url.searchParams.append('limit', params.limit.toString());

    const res = await fetch(url.toString(), {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      return { jobs: [], total: 0, page: 1, limit: 10, pages: 1 };
    }
    return res.json();
  }

  async getJobById(id: string): Promise<Job> {
    const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Job requisition not found');
    return res.json();
  }

  async createJob(jobData: JobCreateInput): Promise<Job> {
    const res = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(jobData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.message || 'Failed to create job requisition');
    }
    return res.json();
  }

  async updateJob(id: string, jobData: Partial<JobCreateInput>): Promise<Job> {
    const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(jobData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.message || 'Failed to update job requisition');
    }
    return res.json();
  }

  async deleteJob(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.message || 'Failed to delete job requisition');
    }
  }
}

export const jobApi = new JobApiService();
