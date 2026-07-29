import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, signToken } from '@/lib/auth';
import { dbService } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const recruiter = await dbService.findRecruiterByEmail(email.toLowerCase());
    
    // For demo convenience, allow 'demo@recruiter.com' / 'password123' if not registered yet
    if (!recruiter && email.toLowerCase() === 'demo@recruiter.com' && password === 'password123') {
      const demoToken = signToken({
        recruiterId: 'demo-recruiter',
        email: 'demo@recruiter.com',
        fullName: 'Sarah Vance',
        companyName: 'TechTalent Inc.',
      });

      const res = NextResponse.json({
        message: 'Demo login successful',
        user: {
          id: 'demo-recruiter',
          fullName: 'Sarah Vance',
          companyName: 'TechTalent Inc.',
          email: 'demo@recruiter.com',
        },
        token: demoToken,
      });

      res.cookies.set('token', demoToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return res;
    }

    if (!recruiter) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, recruiter.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = signToken({
      recruiterId: recruiter.id,
      email: recruiter.email,
      fullName: recruiter.fullName,
      companyName: recruiter.companyName,
    });

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: recruiter.id,
        fullName: recruiter.fullName,
        companyName: recruiter.companyName,
        email: recruiter.email,
      },
      token,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
