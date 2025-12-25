import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BookingInputSchema } from '../types/index.js';
import { logger } from '../logger.js';

export async function apiRoutes(fastify: FastifyInstance): Promise<void> {
  const availabilityService = fastify.container.resolve('availabilityService');
  const reviewsService = fastify.container.resolve('reviewsService');
  const bookingsService = fastify.container.resolve('bookingsService');

  fastify.get('/api/availability', async (_request: FastifyRequest, reply: FastifyReply) => {
    const dates = await availabilityService.getAvailableDates();
    return reply.send(dates);
  });

  fastify.get('/api/reviews', async (_request: FastifyRequest, reply: FastifyReply) => {
    const data = await reviewsService.getApproved();
    return reply.send(data);
  });

  fastify.post('/api/bookings', async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = BookingInputSchema.safeParse(request.body);
    
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: 'Validation error',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const bookingId = await bookingsService.create(parsed.data);
    logger.info({ bookingId }, 'Booking created');

    return reply.send({
      success: true,
      message: 'Booking created successfully',
      bookingId,
    });
  });

  fastify.post('/api/applications', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as Record<string, unknown>;
    logger.info({ type: body.type }, 'Application received');
    return reply.send({ success: true, message: 'Application received' });
  });
}
