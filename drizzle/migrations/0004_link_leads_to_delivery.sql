ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "client_id" uuid REFERENCES "users"("id") ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "project_id" uuid REFERENCES "internal_projects"("id") ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "invoice_id" uuid REFERENCES "invoices"("id") ON DELETE SET NULL;
