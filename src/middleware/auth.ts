import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../models/users.model';
import { roles } from '../models/role.model';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ALLOWED_ROLES = ['admin', 'support'];

export async function authenticateAdmin(request: Request): Promise<any> {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization token required');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Verify user exists and is active
    const [user] = await db
      .select({
        user_id: users.user_id,
        status: users.status,
        user_role: users.user_role
      })
      .from(users)
      .where(eq(users.user_id, decoded.user_id));

    if (!user || !user.status) {
      throw new Error('Invalid or inactive user');
    }

    // Verify role
    const [userRole] = await db
      .select({ name: roles.name })
      .from(roles)
      .where(eq(roles.id, user.user_role));

    if (!userRole || !ALLOWED_ROLES.includes(userRole.name.toLowerCase())) {
      throw new Error('Access denied. Admin or Support role required');
    }

    return {
      user_id: decoded.user_id,
      username: decoded.username,
      role: userRole.name,
      email: decoded.email
    };
  } catch (error) {
    throw new Error('Authentication failed: ' + error.message);
  }
}