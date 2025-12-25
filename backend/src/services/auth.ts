import { User } from '../models/index.js';
import type { User as UserType } from '../types/index.js';

export class AuthService {
  async login(email: string, password: string): Promise<UserType | null> {
    const user = await User.findOne({ where: { email } });
    
    if (!user || !user.verifyPassword(password)) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async getById(id: number): Promise<UserType | null> {
    const user = await User.findByPk(id);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async createUser(email: string, password: string, name: string, role: string): Promise<UserType> {
    const user = await User.create({
      email,
      passwordHash: User.hashPassword(password),
      name,
      role,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
