import { Transporter } from 'nodemailer';
import { logger } from '../logger.js';

export class EmailService {
  private transporter: Transporter;
  private smtpFrom: string;

  constructor({ transporter, smtpFrom }: { transporter: Transporter; smtpFrom: string }) {
    this.transporter = transporter;
    this.smtpFrom = smtpFrom;
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: this.smtpFrom,
      to: to,
      subject: subject,
      html: html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info({ email: to, messageId: info.messageId }, 'Email sent');
    } catch (error) {
      logger.error({ email: to, err: error }, 'Failed to send email');
      throw error;
    }
  }
}

