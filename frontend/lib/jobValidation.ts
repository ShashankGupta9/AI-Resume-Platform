import { z } from 'zod';

export const jobSchema = z
  .object({
    title: z.string().min(3, { message: 'Job title must be at least 3 characters' }),
    department: z.string().min(1, { message: 'Department is required' }),
    employment_type: z.string().min(1, { message: 'Employment type is required' }),
    location: z.string().min(1, { message: 'Location is required' }),
    experience_level: z.string().min(1, { message: 'Experience level is required' }),
    salary_min: z.number({ message: 'Minimum salary must be a number' }).min(0, { message: 'Minimum salary must be a positive number' }),
    salary_max: z.number({ message: 'Maximum salary must be a number' }).min(0, { message: 'Maximum salary must be a positive number' }),
    description: z.string().min(20, { message: 'Description must be at least 20 characters long' }),
    requirements: z.string().min(1, { message: 'Job requirements are required' }),
    required_skills: z
      .array(z.string())
      .min(1, { message: 'At least one required skill must be added' }),
    deadline: z.string().optional(),
    status: z.enum(['OPEN', 'CLOSED', 'DRAFT']),
  })
  .refine((data) => data.salary_max >= data.salary_min, {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['salary_max'],
  });

export type JobFormData = z.infer<typeof jobSchema>;

export const EMPLOYMENT_TYPES = [
  'Full Time',
  'Part Time',
  'Internship',
  'Contract',
  'Remote',
];

export const EXPERIENCE_LEVELS = [
  'Entry Level (0-1 yrs)',
  'Junior (1-3 yrs)',
  'Mid-Level (3-5 yrs)',
  'Senior (5-8 yrs)',
  'Lead / Executive (8+ yrs)',
];

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
];
