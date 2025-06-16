<script lang="ts">
  // @ts-nocheck
  import AgentCreator from '$lib/components/agent-creator/AgentCreator.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { getTemplates, createAgent } from '$lib/supabase';
  import type { AgentTemplate, AgentConfiguration } from '$lib/types/agent';
  import type { Agent } from '$lib/types/agent';
  
  let isLoading = true;
  let error: string | null = null;
  let templates: AgentTemplate[] = [];
  
  // Charger les modèles depuis Supabase
  onMount(async () => {
    try {
      isLoading = true;
      const data = await getTemplates();
      
      // Transformer les données pour correspondre au type attendu
      templates = data.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category || 'Général',
        tags: template.tags || [],
        defaultPrompt: template.default_prompt || template.prompt || '',
        icon: template.icon || '🤖',
        templateId: template.template_id,
        prompt: template.prompt,
        model: template.model || 'gpt-4',
        exportFormats: template.export_formats?.map((f: any) => f.format_id) || []
      }));
      
    } catch (err) {
      console.error('Erreur lors du chargement des modèles:', err);
      error = 'Impossible de charger les modèles. Veuillez réessayer plus tard.';
    } finally {
      isLoading = false;
    }
  });

  async function handleSave(agentConfig: AgentConfiguration) {
    try {
      // Préparer les données pour Supabase
      const agentData = {
        name: agentConfig.name,
        description: agentConfig.description,
        prompt: agentConfig.prompt,
        model: agentConfig.model,
        template_id: agentConfig.templateId,
        metadata: {
          category: agentConfig.category,
          tags: agentConfig.tags,
          icon: agentConfig.icon
        }
      };
      
      // Sauvegarder l'agent dans Supabase
      const savedAgent = await createAgent(agentData);
      
      if (!savedAgent) {
        throw new Error('Erreur lors de la création de l\'agent');
      }
      
      // Sauvegarder les formats d'exportation
      if (agentConfig.exportFormats && agentConfig.exportFormats.length > 0) {
        const exportFormats = agentConfig.exportFormats.map(format => ({
          agent_id: savedAgent.id,
          format_id: format
        }));
        
        await supabase
          .from('agent_export_formats')
          .insert(exportFormats);
      }
      
      // Rediriger vers la page de l'agent créé
      goto(`/agent/${savedAgent.id}`);
      
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'agent :', err);
      error = 'Une erreur est survenue lors de la sauvegarde de l\'agent. Veuillez réessayer.';
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Créer un nouvel agent</h1>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}
  
  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  {:else}
    <div class="bg-white shadow rounded-lg p-6">
      <AgentCreator 
        {templates} 
        on:save={({ detail }) => handleSave(detail)} 
      />
    </div>
  {/if}
</div>
