import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExportPlatform } from '$lib/types/agent';

export const load: PageServerLoad = async ({ params }) => {
  try {
    // In a real app, you would fetch the agent data from your database/API
    // For now, we'll return a properly typed empty agent object
    return {
      agent: {
        id: params.id,
        name: 'Unnamed Agent',
        description: '',
        templateId: '',
        prompt: '',
        exportFormats: ['n8n', 'make', 'nodejs', 'rest', 'ollama'] as const satisfies ExportPlatform[],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  } catch (err) {
    console.error('Error loading agent for export:', err);
    throw error(404, 'Agent non trouvé');
  }
};
