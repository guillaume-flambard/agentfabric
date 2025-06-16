import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type Agent = Tables<'agents'>;
export type AgentTemplate = Tables<'agent_templates'>;
export type ExportFormat = Tables<'export_formats'>;

// Fonctions utilitaires
export const getTemplates = async (): Promise<AgentTemplate[]> => {
  const { data, error } = await supabase
    .from('agent_templates')
    .select(`
      *,
      export_formats:agent_template_export_formats(format_id)
    `);
    
  if (error) throw error;
  return data || [];
};

export const createAgent = async (agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('agents')
    .insert(agent)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Fonction pour obtenir un agent par son ID
export const getAgent = async (id: string): Promise<Agent | null> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) return null;
  return data;
};

// Types pour la base de données
type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          template_id: string | null;
          prompt: string;
          model: string;
          api_key: string | null;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
      };
      agent_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          tags: string[];
          default_prompt: string;
          icon: string;
          model: string;
          prompt: string;
          template_id: string;
          created_at: string;
          updated_at: string;
        };
      };
      export_formats: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          file_extension: string;
          icon: string;
        };
      };
    };
  };
};
