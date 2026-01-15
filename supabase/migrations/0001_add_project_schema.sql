CREATE TABLE IF NOT EXISTS "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"problem" text NOT NULL,
	"solution" text NOT NULL,
	"result" text NOT NULL,
	"image_url" text,
	"tags" jsonb,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
-- Ensure idempotent alterations for users table
DO $$ BEGIN
    ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_unique";
EXCEPTION
    WHEN undefined_object THEN null;
END $$;
--> statement-breakpoint
DROP INDEX IF EXISTS "idx_users_email";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_users_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_active" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "last_login";