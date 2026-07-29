import { Recruiter, Job, JobCreateInput, Resume, AuthResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Attach authorization header if stored in localStorage/cookie
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  // AUTH API
  async register(data: { fullName: string; companyName: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.error || 'Registration failed');
    }
    return res.json();
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.error || 'Login failed');
    }
    return res.json();
  }

  async getMe(): Promise<Recruiter> {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Not authenticated');
    }
    const data = await res.json();
    return data.user;
  }

  // JOBS API
  async getJobs(): Promise<Job[]> {
    const res = await fetch(`${API_BASE_URL}/api/jobs`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    const data = await res.json();
    return data.jobs || [];
  }

  async getJobById(id: string): Promise<Job> {
    const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch job details');
    const data = await res.json();
    return data.job;
  }

  async createJob(jobData: JobCreateInput): Promise<Job> {
    const res = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(jobData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.error || 'Failed to create job');
    }
    const data = await res.json();
    return data.job;
  }

  // RESUMES API
  async getResumes(jobId?: string, search?: string): Promise<Resume[]> {
    const url = new URL(`${API_BASE_URL}/api/resumes`);
    if (jobId && jobId !== 'All') url.searchParams.append('job_id', jobId);
    if (search) url.searchParams.append('search', search);

    const res = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch candidate resumes');
    const data = await res.json();
    return data.resumes || [];
  }

  async uploadResume(formData: FormData): Promise<{ message: string; resume: Resume }> {
    const headers: HeadersInit = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/resumes`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.error || 'Failed to process resume');
    }
    return res.json();
  }

  async deleteResume(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/resumes/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete candidate resume');
  }
}

export const apiService = new ApiService();
