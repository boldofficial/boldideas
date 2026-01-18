-- Finance Module Enhancement Migration
-- Adds tables for: receipts, payments, expenses, bank_accounts

-- Receipts table (generated when invoice is paid)
CREATE TABLE "receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid REFERENCES "invoices"("id") ON DELETE CASCADE,
	"receipt_number" text NOT NULL,
	"amount_paid" text NOT NULL,
	"payment_method" text, -- 'bank_transfer', 'card', 'cash', 'crypto', 'other'
	"payment_reference" text,
	"issued_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint

-- Payments table (supports partial payments)
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid REFERENCES "invoices"("id") ON DELETE CASCADE,
	"receipt_id" uuid REFERENCES "receipts"("id") ON DELETE SET NULL,
	"amount" text NOT NULL,
	"currency" text DEFAULT 'USD',
	"payment_method" text,
	"payment_date" timestamp DEFAULT now(),
	"notes" text,
	"created_by" uuid REFERENCES "users"("id"),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint

-- Bank Accounts table
CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_name" text NOT NULL,
	"bank_name" text NOT NULL,
	"account_number" text,
	"currency" text DEFAULT 'USD',
	"is_primary" boolean DEFAULT false,
	"balance" text DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint

-- Expenses table
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL, -- 'software', 'office', 'marketing', 'travel', 'utilities', 'salary', 'other'
	"description" text,
	"amount" text NOT NULL,
	"currency" text DEFAULT 'USD',
	"expense_date" timestamp DEFAULT now(),
	"receipt_url" text,
	"vendor" text,
	"is_recurring" boolean DEFAULT false,
	"created_by" uuid REFERENCES "users"("id"),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint

-- Add amount_paid column to invoices for tracking partial payments
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "amount_paid" text DEFAULT '0';
