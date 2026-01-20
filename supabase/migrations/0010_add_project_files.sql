-- Migration: Add project_files table for client deliverables
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES internal_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'document', -- 'deliverable', 'document', 'asset', 'image'
  size_bytes INTEGER,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);

-- Add comments for documentation
COMMENT ON TABLE project_files IS 'Files and deliverables attached to internal projects, visible to clients';
COMMENT ON COLUMN project_files.type IS 'File category: deliverable, document, asset, image';
