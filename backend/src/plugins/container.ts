import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { AwilixContainer } from 'awilix';
import { createAppContainer, Cradle } from '../container.js';

declare module 'fastify' {
  interface FastifyInstance {
    container: AwilixContainer<Cradle>;
  }
}

const containerPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const container = createAppContainer(fastify);
  fastify.decorate('container', container);
};

export default fp(containerPlugin, { name: 'container' });

