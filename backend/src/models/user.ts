import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserRole } from '../types/enums.js';
import crypto from 'crypto';

export class User extends Model {
  declare id: number;
  declare email: string;
  declare passwordHash: string;
  declare name: string;
  declare role: UserRole;
  declare createdAt: Date;
  declare updatedAt: Date;

  verifyPassword(password: string): boolean {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    return this.passwordHash === hash;
  }

  static hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
}

export function initUser(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        field: 'password_hash',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.MANAGER,
      },
    },
    {
      sequelize,
      tableName: 'users',
      underscored: true,
    }
  );
}

