import OTP from '../models/otp.model.js';
import transporter from '../config/email.js';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email, purpose) => {
  await OTP.deleteMany({ email, purpose });

  const otp = generateOTP();

  await OTP.create({
    email,
    otp,
    purpose,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: getEmailSubject(purpose),
    html: getEmailTemplate(otp, purpose),
  });
};

export const verifyOTP = async (email, otp, purpose) => {
  const otpRecord = await OTP.findOne({
    email,
    // otp: otp.toString(),
    // purpose,
    // isUsed: false,
    // expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) return false;

  otpRecord.isUsed = true;
  await otpRecord.save();

  return true;
};

const getEmailSubject = (purpose) => {
  const subjects = {
    'email-verification': 'Verify Your Email',
    'password-reset': 'Reset Your Password',
  };
  return subjects[purpose];
};

const getEmailTemplate = (otp, purpose) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Student Marketplace</h2>
      <p>Your OTP for ${purpose} is:</p>
      <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    </div>
  `;
};