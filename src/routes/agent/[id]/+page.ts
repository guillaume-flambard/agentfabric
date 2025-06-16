import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { ExportPlatform } from '$lib/types/agent';

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

export const load: PageLoad = async ({ params }) => {
  try {
    // Dans une application réelle, on récupérerait l'agent depuis une API
    // Pour l'instant, on simule un chargement
    const agentData = {
      id: params.id,
      name: 'Agent de test',
      description: 'Description de test',
      templateId: 'test-template',
      prompt: 'Ceci est un prompt de test',
      model: 'gpt-4',
      exportFormats: ['n8n', 'make'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Conversion des types pour correspondre à l'interface AgentConfiguration
    const agent = {
      ...agentData,
      exportFormats: validateExportFormats(agentData.exportFormats),
      createdAt: new Date(agentData.createdAt),
      updatedAt: new Date(agentData.updatedAt)
    };

    return {
      agent
    };
  } catch (err) {
    console.error('Erreur lors du chargement de l\'agent:', err);
    throw error(404, 'Agent non trouvé');
  }
};
