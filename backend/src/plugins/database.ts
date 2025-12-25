import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { sequelize } from '../models/index.js';
import { logger } from '../logger.js';

const databasePlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await sequelize.authenticate();
  logger.info('Database connected');

  await sequelize.sync();

  fastify.addHook('onClose', async () => {
    await sequelize.close();
    logger.info('Database connection closed');
  });
};

export default fp(databasePlugin, { name: 'database' });
