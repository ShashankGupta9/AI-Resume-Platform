import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { dbService } from '@/lib/db';
import { uploadResumeFile } from '@/lib/supabase';
import { analyzeResume } from '@/lib/ai-matcher';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  const recruiterId = user ? user.recruiterId : 'demo-recruiter';

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId') || undefined;
  const search = searchParams.get('search') || undefined;

  try {
    const resumes = await dbService.getResumes(recruiterId, jobId, search);
    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const jobId = formData.get('jobId') as string;
    let candidateName = formData.get('candidateName') as string;
    let email = formData.get('email') as string;
    let phone = formData.get('phone') as string;

    if (!file || !jobId) {
      return NextResponse.json(
        { error: 'Both resume file and associated job selection are required.' },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension !== 'pdf' && extension !== 'docx') {
      return NextResponse.json(
        { error: 'Invalid file format. Only PDF and DOCX documents are accepted.' },
        { status: 400 }
      );
    }

    // 10MB Size Limit Check
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Fetch target job details for AI matching
    const job = await dbService.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Selected target job does not exist.' }, { status: 404 });
    }

    // Process file with AI Matcher Engine
    const aiResult = await analyzeResume(
      buffer,
      extension,
      job.requiredSkills,
      job.title
    );

    // Auto-fill missing candidate fields from parsed text
    if (!candidateName || candidateName.trim() === '') {
      candidateName = fileName.replace(/\.[^/.]+$/, '').replace(/[_]/g, ' ');
    }
    if (!email && aiResult.extractedCandidateInfo.email) {
      email = aiResult.extractedCandidateInfo.email;
    }
    if (!phone && aiResult.extractedCandidateInfo.phone) {
      phone = aiResult.extractedCandidateInfo.phone;
    }

    // Upload file using Supabase Storage helper (with local fallback)
    const uploadRes = await uploadResumeFile(buffer, fileName, file.type);

    // Create DB Resume record
    const resumeRecord = await dbService.createResume({
      jobId,
      candidateName: candidateName || 'Candidate Applicant',
      email: email || 'candidate@example.com',
      phone: phone || 'N/A',
      fileUrl: uploadRes.url,
      fileName,
      fileType: extension,
      rawText: aiResult.rawText.substring(0, 5000),
      aiMatchScore: aiResult.matchScore,
      aiSummary: aiResult.summary,
      extractedSkills: JSON.stringify(aiResult.extractedSkills),
      status: 'Submitted',
    });

    return NextResponse.json(
      {
        message: 'Resume uploaded and analyzed successfully',
        resume: {
          ...resumeRecord,
          strengths: aiResult.strengths,
          storageType: uploadRes.storageType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during resume processing.' },
      { status: 500 }
    );
  }
}
