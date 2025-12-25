import { Model, DataTypes, Sequelize } from 'sequelize';
import { BookingStatus } from '../types/enums.js';

export class Booking extends Model {
  declare id: number;
  declare checkinDate: Date;
  declare checkoutDate: Date;
  declare adults: number;
  declare children: number;
  declare infants: number;
  declare totalPrice: number;
  declare guestName: string;
  declare guestPhone: string;
  declare guestEmail: string;
  declare status: BookingStatus;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initBooking(sequelize: Sequelize): void {
  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      checkinDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'checkin_date',
      },
      checkoutDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'checkout_date',
      },
      adults: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      children: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      infants: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_price',
      },
      guestName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'guest_name',
      },
      guestPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'guest_phone',
      },
      guestEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'guest_email',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(BookingStatus)),
        defaultValue: BookingStatus.PENDING,
      },
    },
    {
      sequelize,
      tableName: 'bookings',
      underscored: true,
    }
  );
}
