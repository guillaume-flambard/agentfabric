import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    // Récupérer la liste des agents
    const { data: agents, error } = await supabase
      .from('agents')
      .select(`
        *,
        export_formats:agent_export_formats(format_id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transformer les données pour correspondre au type attendu
    const formattedAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      model: agent.model,
      createdAt: new Date(agent.created_at),
      updatedAt: new Date(agent.updated_at),
      exportFormats: agent.export_formats?.map((f: any) => f.format_id) || []
    }));

    return {
      agents: formattedAgents
    };
  } catch (err) {
    console.error('Erreur lors du chargement des agents:', err);
    return {
      agents: []
    };
  }
};
