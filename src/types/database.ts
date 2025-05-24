// Database types for Supabase integration - Updated to match final schema
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          website: string | null
          location: string | null
          phone: string | null
          linkedin_url: string | null
          github_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          location?: string | null
          phone?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          location?: string | null
          phone?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          created_at?: string
          updated_at?: string
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
          download_count: number
          is_public: boolean
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
          download_count?: number
          is_public?: boolean
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
          download_count?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          slug: string | null
          icon: string
          header_image: string | null
          parent_note_id: string | null
          is_published: boolean
          is_archived: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string
          slug?: string | null
          icon?: string
          header_image?: string | null
          parent_note_id?: string | null
          is_published?: boolean
          is_archived?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          slug?: string | null
          icon?: string
          header_image?: string | null
          parent_note_id?: string | null
          is_published?: boolean
          is_archived?: boolean
          view_count?: number
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
      activity_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          resource_type?: string
          resource_id?: string
          metadata?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_activity: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id: string
          p_metadata?: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types for common use cases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type WorkExperience = Database['public']['Tables']['work_experiences']['Row']
export type Education = Database['public']['Tables']['education']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type Certification = Database['public']['Tables']['certifications']['Row']
export type ResumeFile = Database['public']['Tables']['resume_files']['Row']
export type Note = Database['public']['Tables']['notes']['Row']
export type NoteLink = Database['public']['Tables']['note_links']['Row']
export type NoteTag = Database['public']['Tables']['note_tags']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type WorkExperienceInsert = Database['public']['Tables']['work_experiences']['Insert']
export type EducationInsert = Database['public']['Tables']['education']['Insert']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type SkillInsert = Database['public']['Tables']['skills']['Insert']
export type CertificationInsert = Database['public']['Tables']['certifications']['Insert']
export type ResumeFileInsert = Database['public']['Tables']['resume_files']['Insert']
export type NoteInsert = Database['public']['Tables']['notes']['Insert']
export type NoteLinkInsert = Database['public']['Tables']['note_links']['Insert']
export type NoteTagInsert = Database['public']['Tables']['note_tags']['Insert']
export type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type WorkExperienceUpdate = Database['public']['Tables']['work_experiences']['Update']
export type EducationUpdate = Database['public']['Tables']['education']['Update']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type SkillUpdate = Database['public']['Tables']['skills']['Update']
export type CertificationUpdate = Database['public']['Tables']['certifications']['Update']
export type ResumeFileUpdate = Database['public']['Tables']['resume_files']['Update']
export type NoteUpdate = Database['public']['Tables']['notes']['Update']
export type NoteLinkUpdate = Database['public']['Tables']['note_links']['Update']
export type NoteTagUpdate = Database['public']['Tables']['note_tags']['Update']
export type ActivityLogUpdate = Database['public']['Tables']['activity_logs']['Update']

// Extended types with relationships
export type WorkExperienceWithProjects = WorkExperience & {
  projects: Project[]
}

export type ProjectWithWorkExperience = Project & {
  work_experience?: WorkExperience
}

export type NoteWithTags = Note & {
  note_tags: NoteTag[]
}

export type NoteWithLinks = Note & {
  source_links: NoteLink[]
  target_links: NoteLink[]
}

export type NoteWithChildren = Note & {
  children: Note[]
}

export type SkillsByCategory = {
  [category: string]: Skill[]
}

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
export type ResourceType = 
  | 'note' 
  | 'resume_file' 
  | 'profile' 
  | 'work_experience' 
  | 'education' 
  | 'project' 
  | 'skill' 
  | 'certification'
  | 'note_link' 
  | 'note_tag'

// Resume page data structure
export type ResumePageData = {
  profile: Profile
  work_experiences: WorkExperienceWithProjects[]
  education: Education[]
  projects: Project[]
  skills: SkillsByCategory
  certifications: Certification[]
  resume_files: ResumeFile[]
}

// Note content types for the editor
export type NoteContent = {
  type: 'doc'
  content: Array<{
    type: string
    attrs?: Record<string, any>
    content?: Array<any>
    text?: string
  }>
} 