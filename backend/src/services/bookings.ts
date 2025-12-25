import { fn, col } from 'sequelize';
import { Booking } from '../models/index.js';
import type { Booking as BookingType, BookingInput, BookingStats } from '../types/index.js';
import { BookingStatus } from '../types/enums.js';
import { BookingNotificationsService } from './booking-notifications.js';
import { logger } from '../logger.js';

export class BookingsService {
  private bookingNotificationsService: BookingNotificationsService;

  constructor({ bookingNotificationsService }: { bookingNotificationsService: BookingNotificationsService }) {
    this.bookingNotificationsService = bookingNotificationsService;
  }

  async create(data: BookingInput): Promise<number> {
    const booking = await Booking.create({
      checkinDate: data.checkin_date,
      checkoutDate: data.checkout_date,
      adults: data.adults,
      children: data.children,
      infants: data.infants,
      totalPrice: data.total_price,
      guestName: data.guest_name,
      guestPhone: data.guest_phone,
      guestEmail: data.guest_email,
      status: BookingStatus.PENDING,
    });
    return booking.id;
  }

  async getAll(): Promise<BookingType[]> {
    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']],
    });
    return bookings.map(b => this.toDTO(b));
  }

  async getById(id: number): Promise<BookingType | null> {
    const booking = await Booking.findByPk(id);
    return booking ? this.toDTO(booking) : null;
  }

  async confirm(id: number): Promise<void> {
    await Booking.update(
      { status: BookingStatus.CONFIRMED },
      { where: { id } }
    );

    try {
      const booking = await this.getById(id);
      if (booking) {
        await this.bookingNotificationsService.sendConfirmation(booking);
      }
    } catch (error) {
      logger.error({ bookingId: id, err: error }, 'Failed to send confirmation email');
    }
  }

  async cancel(id: number): Promise<void> {
    const booking = await this.getById(id);
    
    await Booking.update(
      { status: BookingStatus.CANCELLED },
      { where: { id } }
    );

    if (booking) {
      try {
        await this.bookingNotificationsService.sendCancellation(booking);
      } catch (error) {
        logger.error({ bookingId: id, err: error }, 'Failed to send cancellation email');
      }
    }
  }

  async getStats(): Promise<BookingStats> {
    const results = await Booking.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
        [fn('COALESCE', fn('SUM', col('total_price')), 0), 'totalRevenue'],
      ],
      group: ['status'],
      raw: true,
    }) as unknown as Array<{ status: string; count: string; totalRevenue: string }>;

    const totals = await Booking.findOne({
      attributes: [
        [fn('COUNT', col('id')), 'count'],
        [fn('COALESCE', fn('SUM', col('total_price')), 0), 'totalRevenue'],
      ],
      raw: true,
    }) as unknown as { count: string; totalRevenue: string } | null;

    const getByStatus = (status: string) => results.find(r => r.status === status);

    return {
      pending: Number(getByStatus(BookingStatus.PENDING)?.count || 0),
      confirmed: Number(getByStatus(BookingStatus.CONFIRMED)?.count || 0),
      cancelled: Number(getByStatus(BookingStatus.CANCELLED)?.count || 0),
      total: Number(totals?.count || 0),
      revenue: {
        pending: Number(getByStatus(BookingStatus.PENDING)?.totalRevenue || 0),
        confirmed: Number(getByStatus(BookingStatus.CONFIRMED)?.totalRevenue || 0),
        total: Number(totals?.totalRevenue || 0),
      },
    };
  }

  private toDTO(booking: Booking): BookingType {
    return {
      id: booking.id,
      checkin_date: booking.checkinDate.toString(),
      checkout_date: booking.checkoutDate.toString(),
      adults: booking.adults,
      children: booking.children,
      infants: booking.infants,
      total_price: Number(booking.totalPrice),
      guest_name: booking.guestName,
      guest_phone: booking.guestPhone,
      guest_email: booking.guestEmail,
      status: booking.status,
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
    };
  }
}
