import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import { config } from '../config/index.js';
import type { User } from '../types/index.js';

declare module 'fastify' {
  interface Session {
    user?: User;
  }
}

const sessionPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyCookie);
  await fastify.register(fastifySession, {
    secret: config.sessionSecret,
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 86400000,
      path: '/',
      sameSite: 'lax',
    },
    saveUninitialized: false,
  });
};

export default fp(sessionPlugin, { name: 'session' });
