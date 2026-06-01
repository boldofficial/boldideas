ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'user',
ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS "avatar_url" text,
ADD COLUMN IF NOT EXISTS "bio" text,
ADD COLUMN IF NOT EXISTS "address" text;
