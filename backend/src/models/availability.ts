import { Model, DataTypes, Sequelize } from 'sequelize';

export class Availability extends Model {
  declare id: number;
  declare date: Date;
  declare isAvailable: boolean;
  declare price: number;
  declare bookingId: number | null;
}

export function initAvailability(sequelize: Sequelize): void {
  Availability.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_available',
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 6000.0,
      },
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'booking_id',
      },
    },
    {
      sequelize,
      tableName: 'availability',
      underscored: true,
      timestamps: false,
    }
  );
}

