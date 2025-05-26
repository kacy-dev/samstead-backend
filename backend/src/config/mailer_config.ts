import nodemailer from 'nodemailer';
import {
  adminRegistrationTemplate,
  userRegistrationTemplate,
  otpForgotPasswordTemplate,
  resendOtpTemplate,
} from '../utils/email_utility';

import dotenv from 'dotenv';
dotenv.config();

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send emails
const sendMail = async (to: string, subject: string, htmlContent: string): Promise<void> => {
  const mailOptions = {
    from: `"Samstead" <support@samstead.com>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Mail Options for User Registration Email
export const sendUserRegistrationEmail = async (
  email: string,
  firstName: string,
  otp: string
): Promise<void> => {
  await sendMail(email, "Welcome to Samstead!", userRegistrationTemplate(firstName, otp));
};

// Mail Options for Admin Registration Email
export const sendAdminRegistrationEmail = async (
  email: string,
  userName: string,
  otp: string
): Promise<void> => {
  await sendMail(email, "Admin Registration at Samstead", adminRegistrationTemplate(userName, otp));
};

// Mail Options for Resend OTP Email
export const sendResendOtpEmail = async (email: string, otp: string): Promise<void> => {
  await sendMail(email, "Your New OTP - Samstead", resendOtpTemplate(otp));
};

// Mail Options for Forgot Password OTP Email
export const sendForgotPasswordOtpEmail = async (
  email: string,
  otp: string,
  firstName: string
): Promise<void> => {
  await sendMail(email, "Forgot Password OTP - Samstead", otpForgotPasswordTemplate(otp, firstName));
};
