import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signToken } from '@/lib/auth';
import { dbService } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, companyName, email, password } = body;

    if (!fullName || !companyName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields (fullName, companyName, email, password) are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingUser = await dbService.findRecruiterByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const recruiter = await dbService.createRecruiter({
      fullName,
      companyName,
      email: email.toLowerCase(),
      password: passwordHash,
    });

    const token = signToken({
      recruiterId: recruiter.id,
      email: recruiter.email,
      fullName: recruiter.fullName,
      companyName: recruiter.companyName,
    });

    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: recruiter.id,
          fullName: recruiter.fullName,
          companyName: recruiter.companyName,
          email: recruiter.email,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
