import { db } from '../db';
import { users } from '../models/user.model';

export class UserService {
  static async getAll() {
    return await db.select().from(users);
  }

  static async create(userData: { name: string; email: string }) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
}