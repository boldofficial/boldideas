
import { pgTable, uuid, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login'),
  isActive: boolean('is_active').default(true).notNull(),
}, (table) => [
  index('idx_users_email').on(table.email),
  index('idx_users_role').on(table.role),
]);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
