import { config } from '$lib/config';


const API_BASE = `${config.API_BASE}/admin`;


export interface Booking {
  id: number;
  checkin_date: string;
  checkout_date: string;
  adults: number;
  children: number;
  infants: number;
  total_price: number;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}


async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    throw new Error('Authentication required');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getBookings(): Promise<Booking[]> {
  const response = await fetch(`${API_BASE}/bookings`, {
    credentials: 'include',
  });
  return handleResponse<Booking[]>(response);
}

export async function getBooking(id: number): Promise<Booking> {
  const response = await fetch(`${API_BASE}/bookings/${id}`, {
    credentials: 'include',
  });
  return handleResponse<Booking>(response);
}

export async function confirmBooking(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/bookings/${id}/confirm`, {
    method: 'POST',
    credentials: 'include',
  });
  await handleResponse<{ success: boolean }>(response);
}

export async function cancelBooking(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
    method: 'POST',
    credentials: 'include',
  });
  await handleResponse<{ success: boolean }>(response);
}
