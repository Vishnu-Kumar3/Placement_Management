import nodemailer from 'nodemailer';
export async function sendStatusEmail(application, student) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('Email skipped: SMTP settings are not configured.'); return;
  }
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: student.email, subject: `Application status: ${application.status}`, text: `Hello ${student.name}, your application status is now ${application.status}.` });
}
