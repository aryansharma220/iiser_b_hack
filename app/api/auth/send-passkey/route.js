import { NextResponse } from 'next/server';
import { sendPasskeyEmail } from '@/lib/nodemailer';

function generatePasskey() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let passkey = '';
  for (let i = 0; i < 6; i++) {
    passkey += chars[Math.floor(Math.random() * chars.length)];
  }
  return passkey;
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const passkey = generatePasskey();
    
    try {
      await sendPasskeyEmail(email, passkey);
      return NextResponse.json({ 
        success: true,
        passkey: passkey, // In production, encrypt this or use secure session storage
        message: 'Passkey sent successfully'
      });
    } catch (emailError) {
      console.error('Passkey sending failed:', emailError);
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
