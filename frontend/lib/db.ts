import { PrismaClient } from '@prisma/client';

// Declare global prisma instance to prevent multiple client instantiation in Next.js dev mode
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// In-Memory Fallback Storage for zero-config local testing before DB migration
interface MemoryRecruiter {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MemoryJob {
  id: string;
  recruiterId: string;
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
  createdAt: Date;
  updatedAt: Date;
}

interface MemoryResume {
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
  uploadDate: Date;
  updatedAt: Date;
}

const memoryStore: {
  recruiters: MemoryRecruiter[];
  jobs: MemoryJob[];
  resumes: MemoryResume[];
} = {
  recruiters: [],
  jobs: [
    {
      id: 'job-1',
      recruiterId: 'demo-recruiter',
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote / San Francisco, CA',
      employmentType: 'Full-Time',
      experienceRequired: '5+ years',
      salaryRange: '$140,000 - $175,000',
      description: 'We are seeking a Senior Full Stack Engineer proficient in React, Next.js, Node.js, and PostgreSQL to lead modern web architecture.',
      requiredSkills: 'React, Next.js, TypeScript, Node.js, PostgreSQL, Tailwind CSS, System Design',
      deadline: '2026-08-30',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'job-2',
      recruiterId: 'demo-recruiter',
      title: 'AI Product Specialist',
      department: 'Product',
      location: 'New York, NY',
      employmentType: 'Full-Time',
      experienceRequired: '3+ years',
      salaryRange: '$120,000 - $150,000',
      description: 'Lead AI features integration, working closely with engineering and user design teams to scale LLM applications.',
      requiredSkills: 'Product Management, Python, LLM, Agile, Figma, Data Analytics',
      deadline: '2026-09-15',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  resumes: [
    {
      id: 'res-1',
      jobId: 'job-1',
      candidateName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      fileUrl: '/uploads/sample_resume_alex.pdf',
      fileName: 'Alex_Morgan_Resume.pdf',
      fileType: 'pdf',
      rawText: 'Senior Full Stack Engineer with 6 years experience in React, Next.js, Node.js, TypeScript, and PostgreSQL.',
      aiMatchScore: 94,
      aiSummary: 'Top candidate with strong full-stack proficiency matching 94% of requirement criteria.',
      extractedSkills: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS']),
      status: 'Shortlisted',
      uploadDate: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'res-2',
      jobId: 'job-1',
      candidateName: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 987-6543',
      fileUrl: '/uploads/sample_resume_sarah.docx',
      fileName: 'Sarah_Jenkins_CV.docx',
      fileType: 'docx',
      rawText: 'Software Engineer specialized in Node.js, Python, and SQL databases.',
      aiMatchScore: 78,
      aiSummary: 'Solid backend developer profile with strong API engineering skills.',
      extractedSkills: JSON.stringify(['Node.js', 'Python', 'SQL', 'Git', 'REST API']),
      status: 'Submitted',
      uploadDate: new Date(),
      updatedAt: new Date(),
    }
  ]
};

// Resilient DB Service
export const dbService = {
  async findRecruiterByEmail(email: string) {
    try {
      return await prisma.recruiter.findUnique({ where: { email } });
    } catch {
      return memoryStore.recruiters.find(r => r.email.toLowerCase() === email.toLowerCase()) || null;
    }
  },

  async createRecruiter(data: Omit<MemoryRecruiter, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      return await prisma.recruiter.create({ data });
    } catch {
      const newRecruiter: MemoryRecruiter = {
        ...data,
        id: `rec-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.recruiters.push(newRecruiter);
      return newRecruiter;
    }
  },

  async getJobsByRecruiter(recruiterId: string) {
    try {
      return await prisma.job.findMany({
        where: { recruiterId },
        include: { _count: { select: { resumes: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } catch {
      return memoryStore.jobs
        .filter(j => j.recruiterId === recruiterId || recruiterId === 'demo-recruiter')
        .map(j => ({
          ...j,
          _count: { resumes: memoryStore.resumes.filter(r => r.jobId === j.id).length }
        }));
    }
  },

  async getJobById(id: string) {
    try {
      return await prisma.job.findUnique({
        where: { id },
        include: { resumes: true }
      });
    } catch {
      const job = memoryStore.jobs.find(j => j.id === id);
      if (!job) return null;
      return {
        ...job,
        resumes: memoryStore.resumes.filter(r => r.jobId === job.id)
      };
    }
  },

  async createJob(data: Omit<MemoryJob, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      return await prisma.job.create({ data });
    } catch {
      const newJob: MemoryJob = {
        ...data,
        id: `job-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.jobs.unshift(newJob);
      return newJob;
    }
  },

  async getResumes(recruiterId: string, jobId?: string, search?: string) {
    try {
      return await prisma.resume.findMany({
        where: {
          job: { recruiterId },
          ...(jobId ? { jobId } : {}),
          ...(search ? {
            OR: [
              { candidateName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { extractedSkills: { contains: search, mode: 'insensitive' } }
            ]
          } : {})
        },
        include: { job: true },
        orderBy: { uploadDate: 'desc' }
      });
    } catch {
      let filtered = memoryStore.resumes;
      if (jobId) {
        filtered = filtered.filter(r => r.jobId === jobId);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(r =>
          r.candidateName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.extractedSkills.toLowerCase().includes(q)
        );
      }
      return filtered.map(r => ({
        ...r,
        job: memoryStore.jobs.find(j => j.id === r.jobId) || {
          id: r.jobId,
          title: 'Senior Software Engineer',
          department: 'Engineering',
          location: 'Remote',
          employmentType: 'Full-Time',
          experienceRequired: '3+ years',
          salaryRange: '$120,000+',
          description: '',
          requiredSkills: '',
          deadline: '2026-12-31',
          status: 'Active',
          recruiterId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }));
    }
  },

  async createResume(data: Omit<MemoryResume, 'id' | 'uploadDate' | 'updatedAt'>) {
    try {
      return await prisma.resume.create({ data });
    } catch {
      const newResume: MemoryResume = {
        ...data,
        id: `res-${Date.now()}`,
        uploadDate: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.resumes.unshift(newResume);
      return newResume;
    }
  },

  async deleteResume(id: string) {
    try {
      return await prisma.resume.delete({ where: { id } });
    } catch {
      const index = memoryStore.resumes.findIndex(r => r.id === id);
      if (index !== -1) {
        memoryStore.resumes.splice(index, 1);
      }
      return { success: true };
    }
  }
};
