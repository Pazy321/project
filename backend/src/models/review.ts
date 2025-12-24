import { Model, DataTypes, Sequelize } from 'sequelize';

export class Review extends Model {
  declare id: number;
  declare guestName: string;
  declare avatarUrl: string | null;
  declare reviewText: string;
  declare rating: number | null;
  declare reviewImages: string | null;
  declare createdAt: Date;
  declare isApproved: boolean;
}

export function initReview(sequelize: Sequelize): void {
  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      guestName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'guest_name',
      },
      avatarUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'avatar_url',
      },
      reviewText: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'review_text',
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 5 },
      },
      reviewImages: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'review_images',
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_approved',
      },
    },
    {
      sequelize,
      tableName: 'reviews',
      underscored: true,
      updatedAt: false,
    }
  );
}

