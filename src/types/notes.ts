// Enhanced Notes System Types

export type ContentType = 'page'

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bullet_list'
  | 'numbered_list'
  | 'quote'
  | 'code'
  | 'image'
  | 'link'
  | 'divider'
  | 'callout'
  | 'toggle'
  | 'table'
  | 'embed'

// Enhanced Note type
export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  slug: string
  icon: string
  header_image?: string
  cover_image?: string
  parent_note_id?: string
  content_type: ContentType
  properties: Record<string, any>
  sort_order: number
  is_published: boolean
  is_archived: boolean
  view_count: number
  last_edited_by?: string
  last_edited_at: string
  created_at: string
  updated_at: string
}

// Note with relationships
export interface NoteWithRelations extends Note {
  parent_note?: Note
  child_notes?: Note[]
  blocks?: NoteBlock[]
  tags?: string[]
}

// Note Block for block-based editing
export interface NoteBlock {
  id: string
  note_id: string
  parent_block_id?: string
  block_type: BlockType
  content: string
  properties: Record<string, any>
  sort_order: number
  created_at: string
  updated_at: string
}

// Note Block with children for nested structure
export interface NoteBlockWithChildren extends NoteBlock {
  children?: NoteBlockWithChildren[]
}

// Editor specific types
export interface EditorState {
  blocks: NoteBlockWithChildren[]
  selection?: {
    blockId: string
    offset: number
  }
  isEditing: boolean
  isDirty: boolean
}

export interface SlashCommand {
  id: string
  label: string
  description: string
  icon: string
  blockType: BlockType
  keywords: string[]
}

// Form types for creating/editing
export interface CreateNoteData {
  title: string
  content?: string
  parent_note_id?: string
  icon?: string
  cover_image?: string
  content_type?: ContentType
  is_published?: boolean
}

export interface UpdateNoteData extends Partial<CreateNoteData> {
  id: string
  last_edited_by: string
}

// API Response types
export interface NotesResponse {
  notes: Note[]
  total: number
  page: number
  hasMore: boolean
}
