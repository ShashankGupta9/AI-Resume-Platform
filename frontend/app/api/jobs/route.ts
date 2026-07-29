import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { dbService } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  const recruiterId = user ? user.recruiterId : 'demo-recruiter';

  try {
    const jobs = await dbService.getJobsByRecruiter(recruiterId);
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  const recruiterId = user ? user.recruiterId : 'demo-recruiter';

  try {
    const body = await req.json();
    const {
      title,
      department,
      location,
      employmentType,
      experienceRequired,
      salaryRange,
      description,
      requiredSkills,
      deadline,
    } = body;

    if (!title || !department || !description || !requiredSkills) {
      return NextResponse.json(
        { error: 'Title, department, description, and required skills are required fields.' },
        { status: 400 }
      );
    }

    const newJob = await dbService.createJob({
      recruiterId,
      title,
      department,
      location: location || 'Remote',
      employmentType: employmentType || 'Full-Time',
      experienceRequired: experienceRequired || '1-3 years',
      salaryRange: salaryRange || 'Competitive',
      description,
      requiredSkills,
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
    });

    return NextResponse.json({ message: 'Job created successfully', job: newJob }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
