import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { config } from './config/index.js';
import { logger } from './logger.js';
import databasePlugin from './plugins/database.js';
import sessionPlugin from './plugins/session.js';
import emailPlugin from './plugins/email.js';
import containerPlugin from './plugins/container.js';
import { apiRoutes } from './routes/api.js';
import { authRoutes } from './routes/auth.js';
import { adminRoutes } from './routes/admin.js';

const fastify = Fastify({ logger: false });

async function start(): Promise<void> {
  await fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await fastify.register(databasePlugin);
  await fastify.register(sessionPlugin);
  await fastify.register(emailPlugin);
  await fastify.register(containerPlugin);

  await fastify.register(apiRoutes);
  await fastify.register(authRoutes);
  await fastify.register(adminRoutes);

  fastify.setErrorHandler((error, _request, reply) => {
    logger.error({ err: error }, 'Server error');
    return reply.status(500).send({ error: 'Internal server error' });
  });

  const shutdown = async () => {
    logger.info('Shutting down server');
    await fastify.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await fastify.listen({ port: config.port, host: config.host });
  logger.info({ port: config.port }, 'Server started');
}

start();
