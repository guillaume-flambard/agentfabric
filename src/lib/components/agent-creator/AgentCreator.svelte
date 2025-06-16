<script lang="ts">
  import { onMount } from 'svelte';
  import AgentExporter from '$lib/components/agent-exporter/AgentExporter.svelte';
  import type { AgentTemplate, AgentConfiguration, ExportPlatform } from '$lib/types/agent';
  
  // Modèles LLM disponibles
  const availableModels = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
    { id: 'llama-3-70b', name: 'Llama 3 70B' },
    { id: 'mistral-large', name: 'Mistral Large' },
    { id: 'custom', name: 'Autre (personnalisé)' }
  ];
  
  export let templates: AgentTemplate[] = [];
  export let onSave: (config: AgentConfiguration) => void;
  
  let selectedTemplate: AgentTemplate | null = null;
  let useTemplate = true;
  let agentConfig: AgentConfiguration = {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    prompt: '',
    model: 'gpt-4',
    templateId: null,
    exportFormats: ['rest', 'nodejs'],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  let showExportModal = false;
  let createdAgent: AgentConfiguration | null = null;
  
  // Réinitialiser le formulaire
  function resetForm() {
    agentConfig = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      prompt: '',
      model: 'gpt-4',
      templateId: null,
      exportFormats: ['rest', 'nodejs'],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    selectedTemplate = null;
  }
  
  // Mettre à jour la configuration lorsqu'un modèle est sélectionné
  function selectTemplate(template: AgentTemplate | null) {
    selectedTemplate = template;
    useTemplate = false;
    
    if (template) {
      // Mettre à jour la configuration avec les données du template
      agentConfig = {
        ...agentConfig,
        name: template.name,
        description: template.description,
        prompt: template.prompt,
        model: template.model || 'gpt-4',
        templateId: template.templateId,
        exportFormats: [...(template.exportFormats || [])],
        category: template.category,
        tags: [...(template.tags || [])],
        icon: template.icon
      };
    } else {
      // Réinitialiser pour un nouvel agent personnalisé
      resetForm();
    }
  }
  
  // Gérer la soumission du formulaire
  function handleSubmit() {
    if (!agentConfig.name || !agentConfig.prompt) {
      // Gérer l'erreur de validation
      return;
    }
    
    const configToSave: AgentConfiguration = {
      ...agentConfig,
      // S'assurer que les champs requis sont définis
      name: agentConfig.name.trim(),
      description: agentConfig.description?.trim() || '',
      prompt: agentConfig.prompt.trim(),
      model: agentConfig.model,
      templateId: agentConfig.templateId,
      exportFormats: [...agentConfig.exportFormats],
      tags: agentConfig.tags || [],
      createdAt: agentConfig.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    onSave(configToSave);
    createdAgent = configToSave;
    showExportModal = true;
  }
  
  function toggleExportFormat(format: ExportPlatform) {
    agentConfig.exportFormats = agentConfig.exportFormats.includes(format)
      ? agentConfig.exportFormats.filter(f => f !== format)
      : [...agentConfig.exportFormats, format];
  }
  
  function closeExportModal() {
    showExportModal = false;
  }
</script>

<div class="max-w-4xl mx-auto p-8">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Créer un nouvel agent</h2>
  {#if useTemplate && templates.length > 0}
      <div>
      <h3 class="text-lg font-medium text-gray-900 mb-4">Choisissez un modèle</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each templates as template}
          <div class="h-full">
            <button 
              type="button"
              class="w-full h-full text-left border rounded-lg p-6 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              on:click={() => {
                selectTemplate(template);
              }}
              on:keydown={(e) => {
                if (e.key === 'Enter') {
                  selectTemplate(template);
                }
              }}
              aria-label={`Sélectionner le modèle ${template.name}`}
            >
              <div class="text-2xl mb-3">{template.icon}</div>
              <h4 class="font-medium text-gray-900">{template.name}</h4>
              <p class="text-sm text-gray-500 mt-1">{template.description}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                {#each template.tags as tag}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag}
                  </span>
                {/each}
              </div>
            </button>
          </div>
        {/each}
      </div>
      
      <div class="mt-8 border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Ou</h3>
        <button 
          type="button"
          class="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          on:click={() => {
            selectTemplate(null);
          }}
        >
          Créer un agent personnalisé
        </button>
      </div>
    </div>
  {:else}
    <div class="space-y-6">
      {#if templates.length > 0}
        <button 
          class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mb-6"
          on:click={() => {
            useTemplate = true;
            selectedTemplate = null;
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Retour aux modèles
        </button>
      {/if}
      
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {selectedTemplate ? selectedTemplate.name : 'Nouvel agent personnalisé'}
          </h3>
          {#if selectedTemplate}
            <p class="mt-1 text-sm text-gray-500">
              {selectedTemplate.description}
            </p>
          {/if}
          
          <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-6">
              <label for="agent-name" class="block text-sm font-medium text-gray-700">
                Nom de l'agent *
              </label>
              <div class="mt-1">
                <input
                  type="text"
                  id="agent-name"
                  bind:value={agentConfig.name}
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ex: Assistant Marketing"
                />
              </div>
            </div>
            
            <div class="sm:col-span-6">
              <label for="agent-description" class="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div class="mt-1">
                  <textarea
                    id="agent-description"
                    rows={2}
                    bind:value={agentConfig.description}
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Décrivez à quoi sert cet agent"
                  ></textarea>
              </div>
            </div>
            
            <div class="sm:col-span-6">
              <label for="agent-model" class="block text-sm font-medium text-gray-700">
                Modèle *
              </label>
              <div class="mt-1">
                <select
                  id="agent-model"
                  bind:value={agentConfig.model}
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {#each availableModels as model}
                    <option value={model.id}>{model.name}</option>
                  {/each}
                </select>
              </div>
            </div>
            
            <div class="sm:col-span-6">
              <label for="agent-api-key" class="block text-sm font-medium text-gray-700">
                Clé API (optionnel)
              </label>
              <div class="mt-1">
                <input
                  type="password"
                  id="agent-api-key"
                  bind:value={agentConfig.apiKey}
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="sk-..."
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Laissez vide pour utiliser la clé API par défaut du système
              </p>
            </div>
            
            <div class="sm:col-span-6">
              <div class="text-sm font-medium text-gray-700 mb-2">
                Formats d'export
              </div>
              <div class="mt-2 space-y-2">
                <div class="flex items-center">
                  <input
                    id="export-rest"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={agentConfig.exportFormats?.includes('rest')}
                    on:change={() => toggleExportFormat('rest')}
                  />
                  <label for="export-rest" class="ml-2 block text-sm text-gray-700">
                    API REST
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="export-nodejs"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={agentConfig.exportFormats?.includes('nodejs')}
                    on:change={() => toggleExportFormat('nodejs')}
                  />
                  <label for="export-nodejs" class="ml-2 block text-sm text-gray-700">
                    Node.js
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="export-n8n"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={agentConfig.exportFormats?.includes('n8n')}
                    on:change={() => toggleExportFormat('n8n')}
                  />
                  <label for="export-n8n" class="ml-2 block text-sm text-gray-700">
                    n8n
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="export-make"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={agentConfig.exportFormats?.includes('make')}
                    on:change={() => toggleExportFormat('make')}
                  />
                  <label for="export-make" class="ml-2 block text-sm text-gray-700">
                    Make (Integromat)
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="export-ollama"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={agentConfig.exportFormats?.includes('ollama')}
                    on:change={() => toggleExportFormat('ollama')}
                  />
                  <label for="export-ollama" class="ml-2 block text-sm text-gray-700">
                    Ollama
                  </label>
                </div>
              </div>
            </div>
            
            <div class="sm:col-span-6">
              <label for="agent-prompt" class="block text-sm font-medium text-gray-700">
                Instructions *
              </label>
              <div class="mt-1">
                  <textarea
                    id="agent-prompt"
                    rows={8}
                    bind:value={agentConfig.prompt}
                    class="font-mono text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Décrivez en détail le rôle et le comportement de l'agent..."
                  ></textarea>
              </div>
              <p class="mt-2 text-sm text-gray-500">
                Ces instructions guideront le comportement de votre agent. Décrivez précisément son rôle, son ton, et comment il doit répondre aux requêtes.
              </p>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              on:click={() => {
                useTemplate = true;
              }}
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="button"
              on:click={handleSubmit}
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={!agentConfig.name || !agentConfig.prompt || !agentConfig.model}
            >
              {selectedTemplate ? 'Créer à partir du modèle' : 'Créer l\'agent'}
            </button>
          </div>
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
