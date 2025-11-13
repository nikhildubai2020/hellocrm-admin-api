import { os } from '@orpc/server';
import { db } from '../db';
import { users } from '../models/users.model';
import { xUsersRoles } from '../models/x-users-roles.model';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = os.handler(async ({ input = {} }) => {
  try {
    const { username, password } = input;
    
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    console.log('Login attempt for:', username);

    const [user] = await db
      .select({
        user_id: users.user_id,
        userName: users.userName,
        first_name: users.first_name,
        last_name: users.last_name,
        mobile_1: users.mobile_1,
        email: users.email,
        password: users.password,
        status: users.status,
        role_name: xUsersRoles.user_role_name
      })
      .from(users)
      .leftJoin(xUsersRoles, eq(users.user_role, xUsersRoles.user_role_id))
      .where(
        or(
          eq(users.userName, username),
          eq(users.mobile_1, username)
        )
      );

    
    if (!user) {
      return {message:'Invalid credentials'}
    }

    if (!user.status) {
      return {message:'Account is inactive'}
    
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.userName,
        email: user.email,
        role: user.role_name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      success: true,
      token,
      user: {
        user_id: user.user_id,
        username: user.userName,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role_name
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
});

export const verifyToken = os.handler(async ({ input = {} }) => {
  try {
    const { token } = input;
    
    if (!token) {
      throw new Error('Token is required');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const [user] = await db
      .select({
        user_id: users.user_id,
        status: users.status
      })
      .from(users)
      .where(eq(users.user_id, decoded.user_id));

    if (!user || !user.status) {
      throw new Error('Invalid or inactive user');
    }

    return {
      valid: true,
      user: decoded
    };
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
});