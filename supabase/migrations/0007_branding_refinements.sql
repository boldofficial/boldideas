-- Add discount fields to invoices
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount_amount TEXT DEFAULT '0';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'fixed';

-- Create company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'Bold Ideas Innovations Ltd.',
    company_address TEXT,
    company_email TEXT,
    company_phone TEXT,
    company_website TEXT,
    logo_url TEXT,
    signature_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default company settings if not exists
INSERT INTO company_settings (company_name, company_email, company_website)
SELECT 'Bold Ideas Innovations Ltd.', 'HQ@boldideas.agency', 'boldideas.agency'
WHERE NOT EXISTS (SELECT 1 FROM company_settings LIMIT 1);
