-- Enhanced Ticket System Migration
-- Adds: departments, ticket numbers, ratings, activity log, canned responses

-- Add new columns to tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS ticket_number TEXT UNIQUE;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'general';
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS rating INTEGER;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS rating_comment TEXT;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS first_response_at TIMESTAMP;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP;

-- Update status check to include new statuses
-- New statuses: open, awaiting_reply, in_progress, on_hold, resolved, closed

-- Create index on ticket_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_department ON tickets(department);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);

-- Canned responses table for quick replies
CREATE TABLE IF NOT EXISTS canned_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    department TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ticket activity log for audit trail
CREATE TABLE IF NOT EXISTS ticket_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_activity_ticket_id ON ticket_activity(ticket_id);

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
    date_part TEXT;
    seq_num INTEGER;
BEGIN
    date_part := TO_CHAR(NOW(), 'YYYYMMDD');
    SELECT COUNT(*) + 1 INTO seq_num 
    FROM tickets 
    WHERE ticket_number LIKE 'TKT-' || date_part || '-%';
    NEW.ticket_number := 'TKT-' || date_part || '-' || LPAD(seq_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket number
DROP TRIGGER IF EXISTS set_ticket_number ON tickets;
CREATE TRIGGER set_ticket_number
    BEFORE INSERT ON tickets
    FOR EACH ROW
    WHEN (NEW.ticket_number IS NULL)
    EXECUTE FUNCTION generate_ticket_number();
