import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendOTPEmail = async (recipientEmail, otp) => {
  try {
    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER
      }
    });

    const info = await transport.verify();
    console.log('SMTP Connection verified:', info);

    const mailOptions = {
      from: {
        name: 'CampusElect',
        address: process.env.SMTP_USER
      },
      to: recipientEmail,
      subject: "Login OTP for CampusElect",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">CampusElect Login Verification</h2>
          <p>Your OTP for login is:</p>
          <h1 style="color: #4f46e5; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    };

    const result = await transport.sendMail(mailOptions);
    console.log('Email sent:', result);
    return true;
  } catch (error) {
    console.error('Nodemailer Error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw new Error(`Email service error: ${error.message}`);
  }
};

export const sendPasskeyEmail = async (recipientEmail, passkey) => {
  try {
    console.log('Sending passkey to:', recipientEmail);

    const mailOptions = {
      from: {
        name: 'CampusElect',
        address: process.env.SMTP_USER
      },
      to: recipientEmail,
      subject: "Your CampusElect Voter Access Passkey",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">CampusElect Voter Access</h2>
          <p>Your secure passkey for voting access is:</p>
          <h1 style="color: #4f46e5; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px; font-family: monospace;">${passkey}</h1>
          <p>This passkey will expire in 5 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this passkey, please ignore this email.</p>
        </div>
      `
    };

    const result = await transport.sendMail(mailOptions);
    console.log('Passkey email sent:', result.messageId);
    return true;
  } catch (error) {
    console.error('Passkey Email Error:', error);
    throw new Error(`Failed to send passkey: ${error.message}`);
  }
};