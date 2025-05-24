-- Enhanced Notes System for Notion-like Functionality
-- Run this in your Supabase SQL Editor after the main schema

-- Add missing columns to notes table
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'page', -- 'page', 'database', 'gallery'
ADD COLUMN IF NOT EXISTS properties JSONB DEFAULT '{}', -- For custom properties
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create note_comments table for public commenting
CREATE TABLE IF NOT EXISTS note_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES note_comments(id) ON DELETE CASCADE, -- For threaded comments
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false, -- Admin must approve
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create note_blocks table for block-based content (like Notion)
CREATE TABLE IF NOT EXISTS note_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  parent_block_id UUID REFERENCES note_blocks(id) ON DELETE CASCADE, -- For nested blocks
  block_type TEXT NOT NULL, -- 'paragraph', 'heading1', 'heading2', 'heading3', 'bullet_list', 'numbered_list', 'quote', 'code', 'image', 'divider', 'callout'
  content TEXT DEFAULT '',
  properties JSONB DEFAULT '{}', -- Block-specific properties (color, alignment, etc.)
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create note_templates table for reusable templates
CREATE TABLE IF NOT EXISTS note_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL, -- Stores the block structure
  category TEXT DEFAULT 'general', -- 'meeting', 'project', 'daily', 'general'
  is_public BOOLEAN DEFAULT false, -- Can other users see this template?
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_interactions table for tracking AI usage
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'summarize', 'expand', 'rewrite', 'suggest', 'search'
  input_text TEXT,
  output_text TEXT,
  model_used TEXT DEFAULT 'gpt-4', -- Track which AI model was used
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER DEFAULT 0,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5), -- User can rate AI response
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create note_search_index table for better search performance
CREATE TABLE IF NOT EXISTS note_search_index (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  content_vector TEXT, -- For semantic search (we'll use text for now, can upgrade to pgvector later)
  keywords TEXT[], -- Extracted keywords
  summary TEXT, -- AI-generated summary for search
  last_indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(note_id)
);

-- Create note_collaboration table for shared editing (future feature)
CREATE TABLE IF NOT EXISTS note_collaboration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  collaborator_email TEXT NOT NULL,
  permission_level TEXT DEFAULT 'read', -- 'read', 'comment', 'edit'
  invited_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  invite_token TEXT UNIQUE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(note_id, collaborator_email)
);

-- Create note_versions table for version history
CREATE TABLE IF NOT EXISTS note_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  content_blocks JSONB DEFAULT '[]', -- Snapshot of blocks at this version
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  change_summary TEXT, -- Brief description of what changed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(note_id, version_number)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_note_comments_note_id ON note_comments(note_id);
CREATE INDEX IF NOT EXISTS idx_note_comments_is_approved ON note_comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_note_comments_parent_id ON note_comments(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_note_blocks_note_id ON note_blocks(note_id);
CREATE INDEX IF NOT EXISTS idx_note_blocks_parent_id ON note_blocks(parent_block_id);
CREATE INDEX IF NOT EXISTS idx_note_blocks_sort_order ON note_blocks(sort_order);
CREATE INDEX IF NOT EXISTS idx_note_blocks_type ON note_blocks(block_type);

CREATE INDEX IF NOT EXISTS idx_note_templates_user_id ON note_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_note_templates_category ON note_templates(category);
CREATE INDEX IF NOT EXISTS idx_note_templates_is_public ON note_templates(is_public);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_note_id ON ai_interactions(note_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_type ON ai_interactions(interaction_type);

CREATE INDEX IF NOT EXISTS idx_note_search_keywords ON note_search_index USING GIN(keywords);

CREATE INDEX IF NOT EXISTS idx_note_collaboration_note_id ON note_collaboration(note_id);
CREATE INDEX IF NOT EXISTS idx_note_collaboration_email ON note_collaboration(collaborator_email);

CREATE INDEX IF NOT EXISTS idx_note_versions_note_id ON note_versions(note_id);
CREATE INDEX IF NOT EXISTS idx_note_versions_number ON note_versions(version_number);

-- Add triggers for updated_at columns
CREATE TRIGGER update_note_comments_updated_at BEFORE UPDATE ON note_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_note_blocks_updated_at BEFORE UPDATE ON note_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_note_templates_updated_at BEFORE UPDATE ON note_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create search index when note is updated
CREATE OR REPLACE FUNCTION update_note_search_index()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract keywords from content (simple approach for now)
  INSERT INTO note_search_index (note_id, keywords, last_indexed_at)
  VALUES (NEW.id, string_to_array(lower(NEW.content), ' '), NOW())
  ON CONFLICT (note_id) 
  DO UPDATE SET 
    keywords = string_to_array(lower(NEW.content), ' '),
    last_indexed_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update search index when note content changes
CREATE TRIGGER update_notes_search_index 
  AFTER INSERT OR UPDATE OF content ON notes
  FOR EACH ROW EXECUTE FUNCTION update_note_search_index();

-- Function to auto-generate slug from title
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

-- Trigger to auto-generate slug
CREATE TRIGGER generate_notes_slug 
  BEFORE INSERT OR UPDATE OF title ON notes
  FOR EACH ROW EXECUTE FUNCTION generate_note_slug();

-- Function to create a new version when note is updated
CREATE OR REPLACE FUNCTION create_note_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Only create version if content actually changed
  IF OLD.content IS DISTINCT FROM NEW.content OR OLD.title IS DISTINCT FROM NEW.title THEN
    -- Get next version number
    SELECT COALESCE(MAX(version_number), 0) + 1 
    INTO next_version 
    FROM note_versions 
    WHERE note_id = NEW.id;
    
    -- Create version record
    INSERT INTO note_versions (
      note_id, 
      version_number, 
      title, 
      content, 
      changed_by,
      change_summary,
      created_at
    ) VALUES (
      NEW.id,
      next_version,
      OLD.title,
      OLD.content,
      NEW.last_edited_by,
      'Content updated',
      OLD.updated_at
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create version history
CREATE TRIGGER create_notes_version 
  AFTER UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION create_note_version();

-- RLS (Row Level Security) Policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_collaboration ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_versions ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Public can view published notes" ON notes
  FOR SELECT USING (is_published = true AND is_archived = false);

CREATE POLICY "Owner can manage all notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

-- Comments policies  
CREATE POLICY "Public can view approved comments" ON note_comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can create comments" ON note_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owner can manage all comments" ON note_comments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = note_comments.note_id AND notes.user_id = auth.uid())
  );

-- Blocks policies
CREATE POLICY "Public can view blocks of published notes" ON note_blocks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = note_blocks.note_id AND notes.is_published = true)
  );

CREATE POLICY "Owner can manage blocks" ON note_blocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = note_blocks.note_id AND notes.user_id = auth.uid())
  );

-- Templates policies
CREATE POLICY "Public can view public templates" ON note_templates
  FOR SELECT USING (is_public = true);

CREATE POLICY "Owner can manage their templates" ON note_templates
  FOR ALL USING (auth.uid() = user_id);

-- AI interactions policies
CREATE POLICY "Owner can view their AI interactions" ON ai_interactions
  FOR ALL USING (auth.uid() = user_id);

-- Collaboration policies
CREATE POLICY "Collaborators can view their invites" ON note_collaboration
  FOR SELECT USING (
    collaborator_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR invited_by = auth.uid()
    OR EXISTS (SELECT 1 FROM notes WHERE notes.id = note_collaboration.note_id AND notes.user_id = auth.uid())
  );

-- Version policies
CREATE POLICY "Public can view versions of published notes" ON note_versions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = note_versions.note_id AND notes.is_published = true)
  );

CREATE POLICY "Owner can manage versions" ON note_versions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = note_versions.note_id AND notes.user_id = auth.uid())
  ); 