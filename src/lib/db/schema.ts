
import { pgTable, text, timestamp, boolean, uuid, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Matches Supabase Auth ID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('user'), // 'admin' | 'user'
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(), // Client Name / Subject
  slug: text('slug').notNull().unique(),
  
  // The Schematic Content Structure
  problem: text('problem').notNull(), // The Glitch
  solution: text('solution').notNull(), // The Fix
  result: text('result').notNull(), // The Upgrade
  
  imageUrl: text('image_url'), // Optional schematic diagram or screenshot
  tags: jsonb('tags').$type<string[]>(), // e.g. ["Automation", "AI", "Zapier"]
  
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),         // Identity_Name
  email: text('email').notNull(),       // Comms_Email
  content: text('content').notNull(),   // Transmission_Content
  status: text('status').default('new'), // 'new', 'read', 'replied'
  createdAt: timestamp('created_at').defaultNow(),
});
