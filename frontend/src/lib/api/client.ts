import { config } from '$lib/config';
import { jsonPayload } from './utils';

const API_BASE = config.API_BASE;

export interface BookingInput {
  checkin_date: string;
  checkout_date: string;
  adults: number;
  children: number;
  infants: number;
  total_price: number;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  bookingId?: number;
  error?: string;
}

export interface Review {
  id: number;
  guest_name: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
}

export interface AvailabilityDate {
  date: string;
  available: boolean;
}

export async function createBooking(data: BookingInput): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    ...jsonPayload(data),
    credentials: 'include',
  });
  return response.json();
}

export async function getReviews(): Promise<Review[]> {
  const response = await fetch(`${API_BASE}/reviews`, {
    credentials: 'include',
  });
  return response.json();
}

export async function getAvailability(): Promise<AvailabilityDate[]> {
  const response = await fetch(`${API_BASE}/availability`, {
    credentials: 'include',
  });
  return response.json();
}

