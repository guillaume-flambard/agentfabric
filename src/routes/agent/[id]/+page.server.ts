import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
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

export const load: PageServerLoad = async ({ params }) => {
  const agentId = params.id;
  
  if (!agentId) {
    throw error(400, 'ID d\'agent manquant');
  }
  
  try {
    // Récupérer l'agent
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select(`
        *,
        export_formats:agent_export_formats(format_id)
      `)
      .eq('id', agentId)
      .single();
    
    if (agentError) throw agentError;
    if (!agent) throw new Error('Agent non trouvé');
    
    // Récupérer les formats d'exportation
    const exportFormats = validateExportFormats(
      agent.export_formats?.map((f: any) => f.format_id) || []
    );
    
    // Transformer les données pour correspondre au type attendu
    const agentData = {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      prompt: agent.prompt,
      model: agent.model,
      templateId: agent.template_id,
      category: agent.metadata?.category,
      tags: agent.metadata?.tags || [],
      icon: agent.metadata?.icon,
      exportFormats,
      createdAt: new Date(agent.created_at),
      updatedAt: new Date(agent.updated_at)
    };
    
    return { agent: agentData };
  } catch (err) {
    console.error('Erreur lors du chargement de l\'agent:', err);
    throw error(500, 'Erreur lors du chargement de l\'agent');
  }
};
