import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import 'dotenv/config';
import { getEnvVar } from '../utils/getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: getEnvVar(SMTP.SMTP_PORT),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
  logger: true,
  debug: true,
});

export const sendEmail = async (options) => {
  const defaultFrom = `"My App" <${getEnvVar(SMTP.SMTP_FROM)}>`;
  return await transporter.sendMail({
    from: options.from || defaultFrom,
    ...options,
  });
};
