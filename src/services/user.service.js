"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../db");
const user_model_1 = require("../models/user.model");
class UserService {
    static async getAll() {
        return await db_1.db.select().from(user_model_1.users);
    }
    static async create(userData) {
        const [user] = await db_1.db.insert(user_model_1.users).values(userData).returning();
        return user;
    }
}
exports.UserService = UserService;
