// Enhanced Notes System Types

export type ContentType = 'page' | 'database' | 'gallery'

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

export type AIInteractionType = 
  | 'summarize'
  | 'expand'
  | 'rewrite'
  | 'suggest'
  | 'search'
  | 'grammar_check'
  | 'translate'

export type PermissionLevel = 'read' | 'comment' | 'edit'

export type TemplateCategory = 'meeting' | 'project' | 'daily' | 'general' | 'academic' | 'creative'

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
  comments?: NoteComment[]
  tags?: string[]
  versions?: NoteVersion[]
  collaborators?: NoteCollaboration[]
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

// Comment system
export interface NoteComment {
  id: string
  note_id: string
  parent_comment_id?: string
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  is_flagged: boolean
  created_at: string
  updated_at: string
}

// Comment with replies
export interface NoteCommentWithReplies extends NoteComment {
  replies?: NoteCommentWithReplies[]
}

// Templates
export interface NoteTemplate {
  id: string
  user_id: string
  name: string
  description?: string
  template_data: NoteBlock[]
  category: TemplateCategory
  is_public: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

// AI Interactions
export interface AIInteraction {
  id: string
  user_id: string
  note_id?: string
  interaction_type: AIInteractionType
  input_text?: string
  output_text?: string
  model_used: string
  tokens_used: number
  processing_time_ms: number
  feedback_rating?: number
  created_at: string
}

// Search Index
export interface NoteSearchIndex {
  id: string
  note_id: string
  content_vector?: string
  keywords: string[]
  summary?: string
  last_indexed_at: string
}

// Collaboration
export interface NoteCollaboration {
  id: string
  note_id: string
  collaborator_email: string
  permission_level: PermissionLevel
  invited_by: string
  invite_token?: string
  accepted_at?: string
  created_at: string
}

// Version History
export interface NoteVersion {
  id: string
  note_id: string
  version_number: number
  title: string
  content: string
  content_blocks: NoteBlock[]
  changed_by?: string
  change_summary?: string
  created_at: string
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

// AI Assistant types
export interface AIRequest {
  type: AIInteractionType
  content: string
  context?: {
    noteId?: string
    selectedText?: string
    cursorPosition?: number
  }
}

export interface AIResponse {
  type: AIInteractionType
  content: string
  suggestions?: string[]
  metadata?: {
    tokensUsed: number
    processingTime: number
    model: string
  }
}

// Search types
export interface SearchResult {
  note: Note
  highlights: string[]
  score: number
  matchType: 'title' | 'content' | 'tag'
}

export interface SearchOptions {
  query: string
  includeArchived?: boolean
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy?: 'relevance' | 'date' | 'title'
}

// Block properties for different block types
export interface ParagraphProperties {
  color?: string
  backgroundColor?: string
  alignment?: 'left' | 'center' | 'right'
}

export interface HeadingProperties extends ParagraphProperties {
  level: 1 | 2 | 3
}

export interface ListProperties extends ParagraphProperties {
  style?: 'bullet' | 'numbered' | 'todo'
  indentLevel?: number
}

export interface ImageProperties {
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  alignment?: 'left' | 'center' | 'right'
}

export interface LinkProperties {
  url: string
  title?: string
  description?: string
  showPreview?: boolean
}

export interface CodeProperties {
  language?: string
  lineNumbers?: boolean
  theme?: string
}

export interface CalloutProperties extends ParagraphProperties {
  emoji?: string
  type?: 'info' | 'warning' | 'error' | 'success'
}

export interface TableProperties {
  rows: number
  columns: number
  hasHeader?: boolean
  data?: string[][]
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

export interface CreateCommentData {
  note_id: string
  parent_comment_id?: string
  author_name: string
  author_email: string
  content: string
}

export interface CreateTemplateData {
  name: string
  description?: string
  template_data: NoteBlock[]
  category: TemplateCategory
  is_public?: boolean
}

// API Response types
export interface NotesResponse {
  notes: Note[]
  total: number
  page: number
  hasMore: boolean
}

export interface NoteHierarchy {
  note: Note
  children: NoteHierarchy[]
  depth: number
}

// Editor plugin types
export interface EditorPlugin {
  name: string
  initialize: (editor: any) => void
  destroy: (editor: any) => void
  commands?: Record<string, Function>
}
