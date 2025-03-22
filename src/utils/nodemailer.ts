import { envConfig } from '@/config/env.config';
import logger from '@/config/logger.config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: envConfig.email.username,
    pass: envConfig.email.password,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const mailOptions = {
      from: envConfig.email.username,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    logger.error(error);
  }
};
