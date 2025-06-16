import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExportPlatform } from '$lib/types/agent';

// In a real app, this would come from a database
const MOCK_AGENTS: Record<string, any> = {
  'ad1fcbfb-b6cb-426c-9eb0-06c38c6980b3': {
    id: 'ad1fcbfb-b6cb-426c-9eb0-06c38c6980b3',
    name: 'Mon Agent IA',
    description: 'Un agent IA personnalisé',
    prompt: 'Tu es un assistant IA utile.',
    model: 'gpt-4',
    exportFormats: ['rest', 'nodejs'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// Fonction utilitaire pour valider les formats d'export
function validateExportFormats(formats: unknown[]): ExportPlatform[] {
  const validFormats: ExportPlatform[] = [];
  const validOptions: ExportPlatform[] = ['n8n', 'make', 'nodejs', 'rest', 'ollama'];
  
  for (const format of formats) {
    if (typeof format === 'string' && validOptions.includes(format as ExportPlatform)) {
      validFormats.push(format as ExportPlatform);
    }
  }
  
  return validFormats;
}

export const load: PageServerLoad = async ({ params }) => {
  try {
    // In a real app, you would fetch from your database here
    const agentData = MOCK_AGENTS[params.id];
    
    if (!agentData) {
      throw error(404, 'Agent non trouvé');
    }
    
    // Validation et conversion des données
    const agent = {
      id: agentData.id || params.id,
      name: agentData.name || 'Sans nom',
      description: agentData.description || '',
      templateId: agentData.templateId,
      prompt: agentData.prompt || '',
      model: agentData.model || 'gpt-4',
      exportFormats: validateExportFormats(agentData.exportFormats || []),
      createdAt: agentData.createdAt ? new Date(agentData.createdAt) : new Date(),
      updatedAt: agentData.updatedAt ? new Date(agentData.updatedAt) : new Date(),
      ...(agentData.metadata || {}) // Inclure les métadonnées supplémentaires
    };
    
    return { agent };
  } catch (err) {
    console.error('Erreur lors du chargement de l\'agent:', err);
    throw error(404, 'Agent non trouvé');
  }
};
