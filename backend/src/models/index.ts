import { Sequelize } from 'sequelize';
import { config } from '../config/index.js';
import { initBooking, Booking } from './booking.js';
import { initAvailability, Availability } from './availability.js';
import { initReview, Review } from './review.js';
import { initUser, User } from './user.js';

export const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'mysql',
    logging: false,
  }
);

initBooking(sequelize);
initAvailability(sequelize);
initReview(sequelize);
initUser(sequelize);

Availability.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
Booking.hasMany(Availability, { foreignKey: 'bookingId', as: 'dates' });

export { Booking, Availability, Review, User };
