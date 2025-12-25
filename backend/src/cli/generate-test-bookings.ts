import Fastify from 'fastify';
import { logger } from '../logger.js';
import databasePlugin from '../plugins/database.js';
import emailPlugin from '../plugins/email.js';
import containerPlugin from '../plugins/container.js';
import type { BookingInput } from '../types/index.js';

// Списки для генерации случайных данных
const firstNames = [
  'Иван', 'Мария', 'Александр', 'Анна', 'Дмитрий', 'Елена', 'Сергей', 'Ольга',
  'Андрей', 'Татьяна', 'Алексей', 'Наталья', 'Владимир', 'Екатерина', 'Николай', 'Юлия',
  'Михаил', 'Ирина', 'Павел', 'Светлана', 'Максим', 'Марина', 'Антон', 'Виктория'
];

const lastNames = [
  'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петрова',
  'Соколов', 'Михайлов', 'Новиков', 'Федоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев',
  'Семенов', 'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев', 'Орлов', 'Андреев'
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generatePhone(): string {
  const codes = ['495', '812', '343', '391', '383', '846', '831', '4212'];
  const code = randomElement(codes);
  const number = String(randomInt(1000000, 9999999));
  return `+7${code}${number}`;
}

function generateEmail(name: string): string {
  const domains = ['gmail.com', 'mail.ru', 'yandex.ru', 'outlook.com', 'hotmail.com'];
  const namePart = name.toLowerCase().replace(/\s+/g, '.');
  const domain = randomElement(domains);
  const number = randomInt(1, 999);
  return `${namePart}${number}@${domain}`;
}

function generateBookingInput(): BookingInput {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const fullName = `${firstName} ${lastName}`;
  
  // Генерируем даты заезда и выезда
  const today = new Date();
  const futureStart = new Date(today);
  futureStart.setDate(today.getDate() + randomInt(1, 90)); // От 1 до 90 дней в будущем
  
  const checkinDate = randomDate(futureStart, new Date(futureStart.getTime() + 60 * 24 * 60 * 60 * 1000));
  const nights = randomInt(1, 7); // От 1 до 7 ночей
  const checkoutDate = new Date(checkinDate);
  checkoutDate.setDate(checkinDate.getDate() + nights);
  
  const adults = randomInt(1, 4);
  const children = randomInt(0, 2);
  const infants = randomInt(0, 1);
  
  // Цена зависит от количества ночей и гостей
  const basePrice = 3000; // Базовая цена за ночь
  const pricePerNight = basePrice + (adults - 1) * 500 + children * 300;
  const totalPrice = pricePerNight * nights;
  
  return {
    checkin_date: formatDate(checkinDate),
    checkout_date: formatDate(checkoutDate),
    adults,
    children,
    infants,
    total_price: Math.round(totalPrice),
    guest_name: fullName,
    guest_phone: generatePhone(),
    guest_email: generateEmail(fullName),
  };
}

async function generateTestBookings(): Promise<void> {
  const args = process.argv.slice(2);
  const count = args.length > 0 ? parseInt(args[0], 10) : 10;
  
  if (isNaN(count) || count < 1 || count > 1000) {
    console.log('Usage: npm run generate-test-bookings [count]');
    console.log('  count: number of bookings to generate (1-1000, default: 10)');
    process.exit(1);
  }

  const fastify = Fastify({ logger: false });

  try {
    // Инициализируем плагины для работы сервисов
    await fastify.register(databasePlugin);
    await fastify.register(emailPlugin);
    await fastify.register(containerPlugin);
    
    const bookingsService = fastify.container.resolve('bookingsService');
    
    logger.info({ count }, 'Starting test bookings generation');

    // Создаем заявки через сервис (все со статусом PENDING)
    for (let i = 0; i < count; i++) {
      const bookingInput = generateBookingInput();
      await bookingsService.create(bookingInput);
    }
    
    logger.info({ count }, 'Test bookings generated successfully');
    console.log(`✓ Successfully generated ${count} test bookings`);
    
    await fastify.close();
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Failed to generate test bookings');
    console.error('✗ Failed to generate test bookings:', error);
    await fastify.close().catch(() => {});
    process.exit(1);
  }
}

generateTestBookings();

