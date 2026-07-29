import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await dbService.getJobById(params.id);
    if (!job) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }
    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return NextResponse.json({ error: 'Failed to fetch job details' }, { status: 500 });
  }
}
