import type { Booking } from '../types/index.js';
import { EmailService } from './email.js';
import { TemplatesService } from './templates.js';

export class BookingNotificationsService {
  private emailService: EmailService;
  private templatesService: TemplatesService;

  constructor({ emailService, templatesService }: { emailService: EmailService; templatesService: TemplatesService }) {
    this.emailService = emailService;
    this.templatesService = templatesService;
  }

  async sendConfirmation(booking: Booking): Promise<void> {
    const checkinDate = new Date(booking.checkin_date).toLocaleDateString('ru-RU');
    const checkoutDate = new Date(booking.checkout_date).toLocaleDateString('ru-RU');
    
    const guests = [
      `${booking.adults} взрослых`,
      booking.children > 0 ? `${booking.children} детей` : null,
      booking.infants > 0 ? `${booking.infants} младенцев` : null,
    ].filter(Boolean).join(', ');

    const templateData = {
      guestName: booking.guest_name,
      bookingId: booking.id,
      checkinDate,
      checkoutDate,
      guests,
      totalPrice: booking.total_price.toLocaleString('ru-RU'),
    };

    const html = await this.templatesService.renderTemplate('emails/booking-confirmation.html', templateData);
    await this.emailService.sendMail(booking.guest_email, 'Подтверждение бронирования', html);
  }

  async sendCancellation(booking: Booking): Promise<void> {
    const checkinDate = new Date(booking.checkin_date).toLocaleDateString('ru-RU');
    const checkoutDate = new Date(booking.checkout_date).toLocaleDateString('ru-RU');
    
    const guests = [
      `${booking.adults} взрослых`,
      booking.children > 0 ? `${booking.children} детей` : null,
      booking.infants > 0 ? `${booking.infants} младенцев` : null,
    ].filter(Boolean).join(', ');

    const templateData = {
      guestName: booking.guest_name,
      bookingId: booking.id,
      checkinDate,
      checkoutDate,
      guests,
      totalPrice: booking.total_price.toLocaleString('ru-RU'),
    };

    const html = await this.templatesService.renderTemplate('emails/booking-cancellation.html', templateData);
    await this.emailService.sendMail(booking.guest_email, 'Отмена бронирования', html);
  }
}

