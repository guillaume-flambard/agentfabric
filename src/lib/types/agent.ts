export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  defaultPrompt: string;
  icon: string;
}

export interface AgentConfiguration {
  id: string;
  name: string;
  description: string;
  templateId: string;
  prompt: string;
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

export interface AgentTemplate extends Omit<AgentConfiguration, 'id' | 'createdAt' | 'updatedAt'> {
  id: string;
  category: string;
  tags: string[];
  defaultPrompt: string;
  icon: string;
  exportFormats: ExportPlatform[];
}
