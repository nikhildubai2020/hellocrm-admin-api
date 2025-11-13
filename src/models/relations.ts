import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { business } from './business.model';

export const usersRelations = relations(users, ({ one }) => ({
  business: one(business, {
    fields: [users.business_id],
    references: [business.business_id]
})
}));

export const businessRelations = relations(business, ({ many }) => ({
  users: many(users)
}));
