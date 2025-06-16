export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          name: string
          description: string
          template_id: string | null
          prompt: string
          model: string
          api_key: string | null
          export_formats: string[]
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          template_id?: string | null
          prompt: string
          model: string
          api_key?: string | null
          export_formats: string[]
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          template_id?: string | null
          prompt?: string
          model?: string
          api_key?: string | null
          export_formats?: string[]
          metadata?: Json | null
          updated_at?: string
        }
      }
      agent_templates: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          tags: string[]
          default_prompt: string
          model: string
          export_formats: string[]
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          tags: string[]
          default_prompt: string
          model: string
          export_formats: string[]
          icon: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          tags?: string[]
          default_prompt?: string
          model?: string
          export_formats?: string[]
          icon?: string
          updated_at?: string
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
  }
}
