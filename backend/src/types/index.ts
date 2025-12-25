import { z } from 'zod';
import { BookingStatus } from './enums.js';

export * from './enums.js';

export const BookingInputSchema = z.object({
  checkin_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkout_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(1).max(10).default(2),
  children: z.number().int().min(0).max(10).default(0),
  infants: z.number().int().min(0).max(5).default(0),
  total_price: z.number().positive(),
  guest_name: z.string().min(2).max(100),
  guest_phone: z.string().min(10).max(20),
  guest_email: z.string().email(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type BookingInput = z.infer<typeof BookingInputSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

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
  status: BookingStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: number;
  guest_name: string;
  avatar_url?: string;
  review_text: string;
  rating?: number;
  review_images?: string;
  created_at: Date;
  is_approved: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface BookingStats {
  pending: number;
  confirmed: number;
  cancelled: number;
  total: number;
  revenue: {
    pending: number;
    confirmed: number;
    total: number;
  };
}

export interface Config {
  port: number;
  host: string;
  db: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
  sessionSecret: string;
  projectRoot: string;
}
