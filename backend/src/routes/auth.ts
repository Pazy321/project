import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { LoginSchema } from '../types/index.js';
import { logger } from '../logger.js';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const authService = fastify.container.resolve('authService');

  fastify.post('/api/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = LoginSchema.safeParse(request.body);
    
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: 'Validation error',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const user = await authService.login(parsed.data.email, parsed.data.password);
    
    if (!user) {
      logger.warn({ email: parsed.data.email }, 'Failed login attempt');
      return reply.status(401).send({
        success: false,
        error: 'Invalid credentials',
      });
    }

    request.session.user = user;
    logger.info({ userId: user.id }, 'User logged in');

    return reply.send({
      success: true,
      user,
    });
  });

  fastify.post('/api/auth/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session.user?.id;
    await request.session.destroy();
    logger.info({ userId }, 'User logged out');
    return reply.send({ success: true });
  });

  fastify.get('/api/auth/me', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.session.user) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }
    return reply.send({ user: request.session.user });
  });
}

