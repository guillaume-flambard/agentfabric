export interface AgentConfiguration {
  id: string;
  name: string;
  description: string;
  templateId?: string;  // Rendre optionnel pour les agents sans template
  prompt: string;
  model: string;      // Modèle à utiliser (ex: gpt-4, claude-2, etc.)
  apiKey?: string;    // Clé API optionnelle pour le modèle
  exportFormats: ExportPlatform[];
  createdAt: Date;
  updatedAt: Date;
}

export type ExportPlatform = 'n8n' | 'make' | 'nodejs' | 'rest' | 'ollama';

export interface ExportFormat {
  id: ExportPlatform;
  name: string;
  description: string;
  fileExtension: string;
  icon: string;
}

export interface AgentExport {
  content: string;
  fileName: string;
  mimeType: string;
}

export interface AgentTemplate extends Omit<AgentConfiguration, 'id' | 'createdAt' | 'updatedAt' | 'exportFormats'> {
  id: string;
  category: string;
  tags: string[];
  defaultPrompt: string;
  icon: string;
  exportFormats: ExportPlatform[];
  model: string;
  prompt: string;
  templateId: string;
}
