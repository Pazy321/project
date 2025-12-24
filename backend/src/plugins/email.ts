import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import nodemailer, { Transporter } from 'nodemailer';
import { logger } from '../logger.js';

declare module 'fastify' {
  interface FastifyInstance {
    emailTransporter: Transporter;
    smtpFrom: string;
  }
}

const emailPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    const missingVars: string[] = [];
    if (!smtpHost) missingVars.push('SMTP_HOST');
    if (!smtpPort) missingVars.push('SMTP_PORT');
    if (!smtpUser) missingVars.push('SMTP_USER');
    if (!smtpPassword) missingVars.push('SMTP_PASSWORD');

    const error = new Error(
      `SMTP configuration is missing. Required environment variables: ${missingVars.join(', ')}`
    );
    logger.error({ error }, 'SMTP configuration error');
    throw error;
  }

  if (!smtpFrom) {
    const error = new Error(
      'SMTP_FROM or SMTP_USER must be set to specify the sender email address'
    );
    logger.error('SMTP_FROM configuration error');
    throw error;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  try {
    await transporter.verify();
    logger.info({ host: smtpHost, port: smtpPort }, 'SMTP connection verified');
  } catch (error) {
    logger.error({ error, host: smtpHost, port: smtpPort }, 'SMTP connection verification failed');
    throw new Error(`Failed to verify SMTP connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  fastify.decorate('emailTransporter', transporter);
  fastify.decorate('smtpFrom', smtpFrom);

  fastify.addHook('onClose', async () => {
    transporter.close();
    logger.info('SMTP transporter closed');
  });
};

export default fp(emailPlugin, { name: 'email' });

