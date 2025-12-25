import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../logger.js';
import { BookingStatus } from '../types/enums.js';

async function adminAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!request.session.user) {
    logger.warn({ url: request.url }, 'Unauthorized admin access');
    return reply.status(401).send({ error: 'Not authenticated' });
  }
}

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  const bookingsService = fastify.container.resolve('bookingsService');
  const availabilityService = fastify.container.resolve('availabilityService');

  fastify.addHook('preHandler', adminAuth);

  fastify.get('/api/admin/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  fastify.get('/api/admin/bookings', async (_request: FastifyRequest, reply: FastifyReply) => {
    const data = await bookingsService.getAll();
    logger.info({ count: data.length }, 'Bookings fetched');
    return reply.send(data);
  });

  fastify.get<{ Params: { id: string } }>(
    '/api/admin/bookings/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const booking = await bookingsService.getById(Number(request.params.id));
      
      if (!booking) {
        return reply.status(404).send({ error: 'Booking not found' });
      }
      
      return reply.send(booking);
    }
  );

  fastify.post<{ Params: { id: string } }>(
    '/api/admin/bookings/:id/confirm',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const id = Number(request.params.id);
      const booking = await bookingsService.getById(id);
      
      if (!booking) {
        return reply.status(404).send({ error: 'Booking not found' });
      }
      
      if (booking.status === BookingStatus.CANCELLED) {
        return reply.status(400).send({ error: 'Cannot confirm cancelled booking' });
      }
      
      if (booking.status === BookingStatus.CONFIRMED) {
        return reply.status(400).send({ error: 'Booking already confirmed' });
      }
      
      await bookingsService.confirm(id);
      logger.info({ bookingId: id }, 'Booking confirmed');
      
      return reply.send({ success: true, message: 'Booking confirmed' });
    }
  );

  fastify.post<{ Params: { id: string } }>(
    '/api/admin/bookings/:id/cancel',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const id = Number(request.params.id);
      const booking = await bookingsService.getById(id);
      
      if (!booking) {
        return reply.status(404).send({ error: 'Booking not found' });
      }
      
      if (booking.status === BookingStatus.CANCELLED) {
        return reply.status(400).send({ error: 'Booking already cancelled' });
      }
      
      await bookingsService.cancel(id);
      await availabilityService.releaseBooking(id);
      logger.info({ bookingId: id }, 'Booking cancelled');
      
      return reply.send({ success: true, message: 'Booking cancelled' });
    }
  );

  fastify.get('/api/admin/stats', async (_request: FastifyRequest, reply: FastifyReply) => {
    const stats = await bookingsService.getStats();
    return reply.send(stats);
  });
}
