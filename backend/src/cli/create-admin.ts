import { sequelize, User } from '../models/index.js';
import { UserRole } from '../types/enums.js';
import { logger } from '../logger.js';

async function createAdmin(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: npm run create-admin <email> <password> <name>');
    process.exit(1);
  }

  const [email, password, name] = args;

  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const existing = await User.findOne({ where: { email } });
    
    if (existing) {
      logger.error({ email }, 'User already exists');
      process.exit(1);
    }

    const user = await User.create({
      email,
      passwordHash: User.hashPassword(password),
      name,
      role: UserRole.ADMIN,
    });

    logger.info({ userId: user.id, email }, 'Admin user created');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Failed to create admin');
    process.exit(1);
  }
}

createAdmin();

