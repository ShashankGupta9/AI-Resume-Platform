export interface Recruiter {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  full_name?: string;
  company_name?: string;
  createdAt?: string;
  created_at?: string;
}

export interface Job {
  id: string;
  recruiterId?: string;
  recruiter_id?: string;
  title: string;
  department: string;
  location: string;
  employmentType?: string;
  employment_type?: string;
  experienceRequired?: string;
  experience_level?: string;
  salaryRange?: string;
  salary_range?: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements?: string;
  requiredSkills?: string | string[];
  required_skills?: string | string[];
  deadline?: string;
  status: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  applicant_count?: number;
  applicantCount?: number;
  _count?: {
    resumes: number;
  };
}

export interface JobCreateInput {
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements?: string;
  required_skills: string | string[];
  deadline?: string;
  status?: string;
  // Legacy camelCase support
  employmentType?: string;
  experienceRequired?: string;
  salaryRange?: string;
  requiredSkills?: string;
}

export interface Resume {
  id: string;
  jobId: string;
  candidateName: string;
  email: string;
  phone: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  rawText?: string;
  aiMatchScore: number;
  aiSummary?: string;
  extractedSkills: string;
  status: string;
  uploadDate: string;
  job?: Job;
}

export interface AuthResponse {
  message: string;
  user: Recruiter;
  token: string;
}

export interface ApiErrorResponse {
  error: string;
  detail?: string;
}
