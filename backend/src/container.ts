import { createContainer, asClass, asValue, asFunction, InjectionMode } from 'awilix';
import { FastifyInstance } from 'fastify';
import { AvailabilityService } from './services/availability.js';
import { BookingsService } from './services/bookings.js';
import { ReviewsService } from './services/reviews.js';
import { AuthService } from './services/auth.js';
import { EmailService } from './services/email.js';
import { TemplatesService } from './services/templates.js';
import { BookingNotificationsService } from './services/booking-notifications.js';
import { config } from './config/index.js';
import { Config } from './types/index.js';

export interface Cradle {
  fastify: FastifyInstance;
  availabilityService: AvailabilityService;
  bookingsService: BookingsService;
  reviewsService: ReviewsService;
  authService: AuthService;
  emailService: EmailService;
  templatesService: TemplatesService;
  bookingNotificationsService: BookingNotificationsService;
  config: Config;
}

export function createAppContainer(fastify: FastifyInstance) {
  const container = createContainer<Cradle>({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({
    fastify: asValue(fastify),
    config: asValue(config),
    availabilityService: asClass(AvailabilityService).singleton(),
    bookingsService: asClass(BookingsService).singleton(),
    reviewsService: asClass(ReviewsService).singleton(),
    authService: asClass(AuthService).singleton(),
    templatesService: asClass(TemplatesService).singleton(),
    emailService: asFunction(() => {
      return new EmailService({
        transporter: fastify.emailTransporter,
        smtpFrom: fastify.smtpFrom,
      });
    }).singleton(),
    bookingNotificationsService: asClass(BookingNotificationsService).singleton(),
  });

  return container;
}
