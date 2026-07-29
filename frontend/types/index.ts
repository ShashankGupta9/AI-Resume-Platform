export interface Recruiter {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  createdAt?: string;
}

export interface Job {
  id: string;
  recruiterId?: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceRequired: string;
  salaryRange: string;
  description: string;
  requiredSkills: string;
  deadline: string;
  status: string;
  createdAt: string;
  _count?: {
    resumes: number;
  };
}

export interface JobCreateInput {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceRequired: string;
  salaryRange: string;
  description: string;
  requiredSkills: string;
  deadline: string;
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
}
