<script lang="ts">
  import { onMount } from 'svelte';
  import type { AgentTemplate, AgentConfiguration } from '$lib/types/agent';
  import AgentExporter from '$lib/components/agent-exporter/AgentExporter.svelte';
  
  export let templates: AgentTemplate[] = [];
  export let onSave: (config: AgentConfiguration) => void;
  
  let selectedTemplate: AgentTemplate | null = null;
  let agentConfig: Partial<AgentConfiguration> = {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    prompt: ''
  };
  
  let showExportModal = false;
  let createdAgent: AgentConfiguration | null = null;
  
  function selectTemplate(template: AgentTemplate) {
    selectedTemplate = template;
    agentConfig = {
      ...agentConfig,
      templateId: template.id,
      exportFormats: template.exportFormats || [],
      prompt: template.defaultPrompt
    };
  }
  
  function handleSubmit() {
    if (!selectedTemplate || !agentConfig.name || !agentConfig.prompt) return;
    
    const config: AgentConfiguration = {
      id: agentConfig.id!,
      name: agentConfig.name,
      description: agentConfig.description || '',
      templateId: selectedTemplate.id,
      prompt: agentConfig.prompt,
      exportFormats: selectedTemplate.exportFormats || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    createdAgent = config;
    onSave(config);
  }
  
  function openExportModal() {
    showExportModal = true;
  }
  
  function closeExportModal() {
    showExportModal = false;
  }
</script>

<div class="max-w-4xl mx-auto p-8">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Créer un nouvel agent</h2>
  
  {#if !selectedTemplate}
    <div>
      <h3 class="text-lg font-medium text-gray-900 mb-4">Choisissez un modèle d'agent</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {#each templates as template}
          <div 
            class="border border-gray-200 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md hover:border-blue-300 hover:-translate-y-1"
            on:click={() => selectTemplate(template)}
          >
            <h4 class="text-lg font-medium text-gray-900 mb-2">{template.name}</h4>
            <p class="text-gray-600 text-sm mb-4">{template.description}</p>
            <div class="flex flex-wrap gap-2">
              {#each template.tags as tag}
                <span class="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">
                  {tag}
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="space-y-6">
      <button 
        class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mb-6"
        on:click={() => selectedTemplate = null}
      >
        <span>←</span>
        <span>Retour aux modèles</span>
      </button>
      
      <h3 class="text-xl font-semibold text-gray-900">Configurer {selectedTemplate.name}</h3>
      
      <div class="space-y-1">
        <label for="agent-name" class="block text-sm font-medium text-gray-700">
          Nom de l'agent
        </label>
        <input 
          id="agent-name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          bind:value={agentConfig.name}
          placeholder="Ex: Rédacteur LinkedIn Pro"
        />
      </div>
      
      <div class="space-y-1">
        <label for="agent-description" class="block text-sm font-medium text-gray-700">
          Description (optionnel)
        </label>
        <textarea 
          id="agent-description"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          rows="3"
          bind:value={agentConfig.description}
          placeholder="Décrivez le rôle de votre agent..."
        ></textarea>
      </div>
      
      <div class="space-y-1">
        <label for="agent-prompt" class="block text-sm font-medium text-gray-700">
          Prompt personnalisé
        </label>
        <textarea 
          id="agent-prompt"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono text-sm"
          rows="10"
          bind:value={agentConfig.prompt}
          placeholder="Définissez le comportement de votre agent..."
        ></textarea>
      </div>
      
      <div class="mt-8 flex justify-between">
        <div>
          {#if createdAgent}
            <button
              on:click={openExportModal}
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Exporter l'agent
            </button>
          {/if}
        </div>
        <div class="space-x-3">
          <button
            type="button"
            on:click={() => selectedTemplate = null}
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            on:click={handleSubmit}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={!selectedTemplate || !agentConfig.name || !agentConfig.prompt}
          >
            {createdAgent ? 'Mettre à jour' : 'Créer'} l'agent
          </button>
        </div>
      </div>
      
      {#if createdAgent && showExportModal}
        <AgentExporter
          agent={createdAgent}
          isOpen={showExportModal}
          onClose={closeExportModal}
        />
      {/if}
    </div>
  {/if}
</div>
