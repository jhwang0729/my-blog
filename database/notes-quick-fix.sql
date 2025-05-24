-- Quick fix for missing columns in notes table
-- Run this in Supabase SQL Editor to fix immediate errors

-- Add missing columns to existing notes table
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'page',
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS properties JSONB DEFAULT '{}';

-- Create note_blocks table for block-based content
CREATE TABLE IF NOT EXISTS note_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  parent_block_id UUID REFERENCES note_blocks(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  content TEXT DEFAULT '',
  properties JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_note_blocks_note_id ON note_blocks(note_id);
CREATE INDEX IF NOT EXISTS idx_note_blocks_sort_order ON note_blocks(sort_order);

-- Function to auto-generate slug from title (if doesn't exist)
CREATE OR REPLACE FUNCTION generate_note_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug from title
  base_slug := lower(trim(regexp_replace(NEW.title, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'untitled';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for conflicts and add counter if needed
  WHILE EXISTS (SELECT 1 FROM notes WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating slugs (if doesn't exist)
DROP TRIGGER IF EXISTS generate_notes_slug ON notes;
CREATE TRIGGER generate_notes_slug 
  BEFORE INSERT OR UPDATE OF title ON notes
  FOR EACH ROW EXECUTE FUNCTION generate_note_slug(); 