"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityService = void 0;
const db_1 = require("../db");
const city_model_1 = require("../models/city.model");
class CityService {
    static async getAll() {
        return await db_1.db.select().from(city_model_1.cities);
    }
    static async create(cityData) {
        const [city] = await db_1.db.insert(city_model_1.cities).values(cityData).returning();
        return city;
    }
}
exports.CityService = CityService;
