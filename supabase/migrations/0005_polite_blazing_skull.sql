ALTER TABLE "campaigns" ALTER COLUMN "recipient_count" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "recipient_count" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_number" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "paid_at" timestamp;