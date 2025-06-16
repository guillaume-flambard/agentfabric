<script lang="ts">
  import { onMount } from 'svelte';
  import type { AgentTemplate, AgentConfiguration } from '$lib/types/agent';
  
  export let templates: AgentTemplate[] = [];
  export let onSave: (config: AgentConfiguration) => void;
  
  let selectedTemplate: AgentTemplate | null = null;
  let agentConfig: Partial<AgentConfiguration> = {
    name: '',
    description: '',
    prompt: ''
  };
  
  function selectTemplate(template: AgentTemplate) {
    selectedTemplate = template;
    agentConfig = {
      ...agentConfig,
      templateId: template.id,
      prompt: template.defaultPrompt
    };
  }
  
  function handleSubmit() {
    if (!selectedTemplate || !agentConfig.name || !agentConfig.prompt) return;
    
    const config: AgentConfiguration = {
      id: crypto.randomUUID(),
      name: agentConfig.name,
      description: agentConfig.description || '',
      templateId: selectedTemplate.id,
      prompt: agentConfig.prompt,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onSave(config);
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
      
      <div class="flex justify-end space-x-3 pt-4">
        <button 
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          on:click={() => selectedTemplate = null}
        >
          Annuler
        </button>
        <button 
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          on:click={handleSubmit}
        >
          Créer l'agent
        </button>
      </div>
    </div>
  {/if}
</div>


