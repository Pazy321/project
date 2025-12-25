import { Availability } from '../models/index.js';

export class AvailabilityService {
  async getAvailableDates(): Promise<string[]> {
    const results = await Availability.findAll({
      where: { isAvailable: true },
      attributes: ['date'],
      raw: true,
    });
    return results.map(r => r.date.toString());
  }

  async markAsBooked(bookingId: number, dates: string[]): Promise<void> {
    await Availability.update(
      { isAvailable: false, bookingId },
      { where: { date: dates } }
    );
  }

  async releaseBooking(bookingId: number): Promise<void> {
    await Availability.update(
      { isAvailable: true, bookingId: null },
      { where: { bookingId } }
    );
  }
}
