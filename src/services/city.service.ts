import { db } from '../db';
import { cities } from '../models/city.model';

export class CityService {
  static async getAll() {
    return await db.select().from(cities);
  }

  static async create(cityData: { name: string; state: string; country: string }) {
    const [city] = await db.insert(cities).values(cityData).returning();
    return city;
  }
}