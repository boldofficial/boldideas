ALTER TABLE "invoices" ADD COLUMN "is_recurring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_frequency" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_next_date" timestamp;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_end_date" timestamp;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_source_invoice_id" uuid;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_recurring_source_invoice_id_invoices_id_fk" FOREIGN KEY ("recurring_source_invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;