import * as nodemailer from "nodemailer";

import { config } from "../constants/settings";
const transporter = nodemailer.createTransport({
  service: "gmail",
  // Mail service would be upgraded to mailjet eventually
  auth: {
    user: config.mailing.emailSender,
    pass: config.mailing.gmail_pass,
  },
});

export interface MailParams {
  to: string;
  subject: string;
  html: string;
}

interface otpEmail {
  recipient: string;
  otp: string;
}

export const Mailer = {
  async sendEmail(body: MailParams) {
    await transporter.sendMail({
      to: body.to,
      from: config.mailing.emailSender,
      subject: body.subject,
      html: body.html,
    });
  },

  async sendSignupOtp(payload: otpEmail) {
    console.log(payload);
    await this.sendEmail({
      to: payload.recipient,
      subject: "VERIFY YOUR EMAIL",
      html: `Welcome, verify your email using ${payload.otp}, otp will expire in 10 minutes `,
    });
  },
};

// html: `Welcome, verify your email using ${payload.otp}, otp will expire in 10 minutes `,
