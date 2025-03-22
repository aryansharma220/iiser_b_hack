import { NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/nodemailer';

export async function POST(request) {
  try {
    console.log('Environment check:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      userExists: !!process.env.SMTP_USER,
      passExists: !!process.env.SMTP_PASS
    });

    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    try {
      await sendOTPEmail(email, otp);
      return NextResponse.json({ 
        success: true,
        message: 'OTP sent successfully'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { 
          error: 'Email service error',
          message: emailError.message
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}
