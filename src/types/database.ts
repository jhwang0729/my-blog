// Database types for Supabase integration - Updated to match final schema
export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      work_experiences: {
        Row: {
          id: string
          user_id: string
          company_name: string
          job_title: string
          employment_type: string | null
          start_date: string
          end_date: string | null
          description: string | null
          technologies: string[] | null
          location: string | null
          company_url: string | null
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          job_title: string
          employment_type?: string | null
          start_date: string
          end_date?: string | null
          description?: string | null
          technologies?: string[] | null
          location?: string | null
          company_url?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          job_title?: string
          employment_type?: string | null
          start_date?: string
          end_date?: string | null
          description?: string | null
          technologies?: string[] | null
          location?: string | null
          company_url?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      education: {
        Row: {
          id: string
          user_id: string
          institution_name: string
          degree: string | null
          field_of_study: string | null
          start_date: string | null
          end_date: string | null
          gpa: number | null
          description: string | null
          location: string | null
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          institution_name: string
          degree?: string | null
          field_of_study?: string | null
          start_date?: string | null
          end_date?: string | null
          gpa?: number | null
          description?: string | null
          location?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          institution_name?: string
          degree?: string | null
          field_of_study?: string | null
          start_date?: string | null
          end_date?: string | null
          gpa?: number | null
          description?: string | null
          location?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          work_experience_id: string | null
          title: string
          description: string | null
          technologies: string[] | null
          start_date: string | null
          end_date: string | null
          project_url: string | null
          github_url: string | null
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          work_experience_id?: string | null
          title: string
          description?: string | null
          technologies?: string[] | null
          start_date?: string | null
          end_date?: string | null
          project_url?: string | null
          github_url?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          work_experience_id?: string | null
          title?: string
          description?: string | null
          technologies?: string[] | null
          start_date?: string | null
          end_date?: string | null
          project_url?: string | null
          github_url?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string | null
          proficiency_level: number | null
          years_of_experience: number | null
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category?: string | null
          proficiency_level?: number | null
          years_of_experience?: number | null
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string | null
          proficiency_level?: number | null
          years_of_experience?: number | null
          is_visible?: boolean
          created_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          user_id: string
          name: string
          issuing_organization: string
          issue_date: string | null
          expiration_date: string | null
          credential_id: string | null
          credential_url: string | null
          description: string | null
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          issuing_organization: string
          issue_date?: string | null
          expiration_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          issuing_organization?: string
          issue_date?: string | null
          expiration_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      resume_files: {
        Row: {
          id: string
          user_id: string
          file_name: string
          original_filename: string
          file_url: string
          file_size: number | null
          file_type: string | null
          upload_date: string
          download_count: number
          is_public: boolean
          version: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          original_filename: string
          file_url: string
          file_size?: number | null
          file_type?: string | null
          upload_date?: string
          download_count?: number
          is_public?: boolean
          version?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          original_filename?: string
          file_url?: string
          file_size?: number | null
          file_type?: string | null
          upload_date?: string
          download_count?: number
          is_public?: boolean
          version?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          first_name: string | null
          last_name: string | null
          bio: string | null
          location: string | null
          website: string | null
          linkedin: string | null
          github: string | null
          twitter: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          linkedin?: string | null
          github?: string | null
          twitter?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          linkedin?: string | null
          github?: string | null
          twitter?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          slug: string
          icon: string | null
          header_image: string | null
          parent_note_id: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          slug: string
          icon?: string | null
          header_image?: string | null
          parent_note_id?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          slug?: string
          icon?: string | null
          header_image?: string | null
          parent_note_id?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      note_links: {
        Row: {
          id: string
          source_note_id: string
          target_note_id: string
          created_at: string
        }
        Insert: {
          id?: string
          source_note_id: string
          target_note_id: string
          created_at?: string
        }
        Update: {
          id?: string
          source_note_id?: string
          target_note_id?: string
          created_at?: string
        }
      }
      note_tags: {
        Row: {
          id: string
          note_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          note_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          note_id?: string
          tag?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[keyof Database]

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// Only keep commonly used Row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type WorkExperience = Database['public']['Tables']['work_experiences']['Row']
export type Education = Database['public']['Tables']['education']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type ResumeFile = Database['public']['Tables']['resume_files']['Row']
export type Note = Database['public']['Tables']['notes']['Row']

// API response types
export type ApiResponse<T> = {
  data: T | null
  error: string | null
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Enum types for better type safety
export type EmploymentType = 'full-time' | 'part-time' | 'internship' | 'volunteer' | 'academic'
export type SkillCategory = 'programming' | 'languages' | 'tools' | 'frameworks'
export type ActivityAction = 'create' | 'update' | 'delete' | 'view' | 'download' | 'upload'
export type ResourceType = 'note' | 'resume_file' | 'profile' | 'work_experience' | 'education' | 'project' | 'skill'

// Resume page data structure
export type ResumePageData = {
  profile: Profile
  work_experiences: WorkExperience[]
  education: Education[]
  projects: Project[]
  skills: Skill[]
  resume_files: ResumeFile[]
}

// Note content types for the editor
export type NoteContent = {
  type: 'doc'
  content: Array<{
    type: string
    attrs?: Record<string, unknown>
    content?: Array<unknown>
    text?: string
  }>
}
