-- Add title field to invoice_items
ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS title TEXT;
-- Make description optional (migrating old descriptions to titles if needed, but for now just allowing null)
ALTER TABLE invoice_items ALTER COLUMN description DROP NOT NULL;
