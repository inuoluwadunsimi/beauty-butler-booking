import { Resend } from "resend";
import { config } from "../constants/settings";

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
  resend: new Resend(config.mailing.resendAPIKey),
  async sendEmail(body: MailParams) {
    await this.resend.emails.send({
      from: config.mailing.emailSender,
      to: body.to,
      subject: body.subject,
      html: body.html,
    });
  },

  async sendSignupOtp(payload: otpEmail) {
    await this.sendEmail({
      to: payload.recipient,
      subject: "VERIFY YOUR EMAIL",
      html: `Welcome, verify your email using ${payload.otp}, otp will expire in 10 minutes `,
    });
  },
};
