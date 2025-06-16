// Types de base de données (correspondent aux tables Supabase)

export type ExportPlatform = 'n8n' | 'make' | 'nodejs' | 'rest' | 'ollama';

/** Format d'exportation disponible pour les agents */
export interface DbExportFormat {
  id: ExportPlatform;
  name: string;
  description: string;
  file_extension: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

/** Modèle d'agent dans la base de données */
export interface DbAgentTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  default_prompt: string;
  model: string;
  category: string;
  tags: string[];
  icon: string;
  template_id: string;
  created_at: string;
  updated_at: string;
}

/** Agent dans la base de données */
export interface DbAgent {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model: string;
  template_id: string | null;
  metadata: {
    category?: string;
    tags?: string[];
    icon?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

/** Relation entre un agent et ses formats d'export */
export interface DbAgentExportFormat {
  id: string;
  agent_id: string;
  format_id: ExportPlatform;
  created_at: string;
}

/** Relation entre un modèle et ses formats d'export */
export interface DbTemplateExportFormat {
  id: string;
  template_id: string;
  format_id: ExportPlatform;
  created_at: string;
}

// Types d'application (utilisés dans le frontend et l'API)

/** Configuration d'un agent pour l'application */
export interface AgentConfiguration {
  id: string;
  name: string;
  description: string;
  templateId: string | null;
  prompt: string;
  model: string;
  apiKey?: string;
  exportFormats: ExportPlatform[];
  category?: string;
  tags: string[];
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Modèle d'agent pour l'application */
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  defaultPrompt: string;
  model: string;
  category: string;
  tags: string[];
  icon: string;
  templateId: string;
  exportFormats: ExportPlatform[];
  createdAt: Date;
  updatedAt: Date;
}

/** Format d'exportation pour l'application */
export interface ExportFormat {
  id: ExportPlatform;
  name: string;
  description: string;
  fileExtension: string;
  icon: string;
}

/** Résultat d'exportation d'un agent */
export interface AgentExport {
  content: string;
  fileName: string;
  mimeType: string;
}

// Fonctions utilitaires pour la conversion entre les types

export function dbAgentToAgent(dbAgent: DbAgent, exportFormats: ExportPlatform[] = []): AgentConfiguration {
  return {
    id: dbAgent.id,
    name: dbAgent.name,
    description: dbAgent.description,
    prompt: dbAgent.prompt,
    model: dbAgent.model,
    templateId: dbAgent.template_id,
    category: dbAgent.metadata?.category,
    tags: dbAgent.metadata?.tags || [],
    icon: dbAgent.metadata?.icon,
    exportFormats,
    createdAt: new Date(dbAgent.created_at),
    updatedAt: new Date(dbAgent.updated_at)
  };
}

export function dbTemplateToAgentTemplate(
  dbTemplate: DbAgentTemplate,
  exportFormats: ExportPlatform[] = []
): AgentTemplate {
  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    description: dbTemplate.description,
    prompt: dbTemplate.prompt,
    defaultPrompt: dbTemplate.default_prompt,
    model: dbTemplate.model,
    category: dbTemplate.category,
    tags: dbTemplate.tags,
    icon: dbTemplate.icon,
    templateId: dbTemplate.template_id,
    exportFormats,
    createdAt: new Date(dbTemplate.created_at),
    updatedAt: new Date(dbTemplate.updated_at)
  };
}

export function dbExportFormatToExportFormat(dbFormat: DbExportFormat): ExportFormat {
  return {
    id: dbFormat.id,
    name: dbFormat.name,
    description: dbFormat.description,
    fileExtension: dbFormat.file_extension,
    icon: dbFormat.icon
  };
}
