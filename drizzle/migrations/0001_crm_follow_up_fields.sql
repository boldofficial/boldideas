ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "service_interest" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "priority" text DEFAULT 'medium';
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "next_follow_up_at" timestamp;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "lost_reason" text;
