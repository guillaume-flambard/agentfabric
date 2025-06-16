<script lang="ts">
  import { downloadFile, copyToClipboard } from '$lib/utils/file';
  import { fade } from 'svelte/transition';
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { generateAgentExport } from '$lib/utils/export-generator';
  import type { AgentConfiguration, ExportPlatform } from '$lib/types/agent';
  
  // Gestion de la fermeture au clavier
  function handleKeyDown(event: { key: string }) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  export let agent: AgentConfiguration;
  export let isOpen = false;
  export let onClose: () => void;

  const exportFormats = [
    {
      id: 'n8n',
      name: 'n8n',
      description: 'Workflow JSON pour n8n',
      icon: '🔌',
      fileExtension: 'json'
    },
    {
      id: 'make',
      name: 'Make.com',
      description: 'Scénario Make.com',
      icon: '⚙️',
      fileExtension: 'json'
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      description: 'Script Node.js',
      icon: '🟢',
      fileExtension: 'js'
    },
    {
      id: 'rest',
      name: 'API REST',
      description: 'Point de terminaison REST',
      icon: '🌐',
      fileExtension: 'json'
    },
    {
      id: 'ollama',
      name: 'Ollama',
      description: 'Modèle Ollama',
      icon: '🤖',
      fileExtension: 'md'
    }
  ];

  let selectedFormat: ExportPlatform | null = null;
  let exportContent = '';
  let currentFileName = '';
  let currentMimeType = 'text/plain';
  let isLoading = false;
  let error: string | null = null;

  function closeModal() {
    selectedFormat = null;
    exportContent = '';
    onClose();
  }

  function handleBack() {
    selectedFormat = null;
    exportContent = '';
  }

  async function generateExport(format: ExportPlatform) {
    try {
      isLoading = true;
      error = null;
      
      // Génération de l'export
      const exportData = generateAgentExport(agent, format);
      
      exportContent = exportData.content;
      selectedFormat = format;
      currentFileName = exportData.fileName;
      currentMimeType = exportData.mimeType;
    } catch (err: unknown) {
      console.error('Erreur lors de la génération de l\'export:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      error = `Erreur lors de la génération de l'export: ${errorMessage}`;
    } finally {
      isLoading = false;
    }
  }

  async function handleCopyToClipboard(event: MouseEvent) {
    event.preventDefault();
    try {
      await copyToClipboard(exportContent);
      // Vous pourriez ajouter un toast ou une notification de succès ici
    } catch (err) {
      console.error('Erreur lors de la copie dans le presse-papier:', err);
      error = 'Erreur lors de la copie dans le presse-papier';
    }
  }

  function handleDownload() {
    if (!currentFileName || !exportContent) return;
    
    downloadFile(
      exportContent,
      currentFileName,
      currentMimeType
    );
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    role="dialog"
    aria-modal="true"
    aria-labelledby="export-modal-title"
    tabindex="-1"
    on:click|self={closeModal}
    on:keydown={handleKeyDown}
    transition:fade={{ duration: 150 }}
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true"></div>
      
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
        in:fly={{ y: 20, duration: 200, easing: quintOut }}
        out:fly={{ y: -20, duration: 150, easing: quintOut }}
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {#if !selectedFormat}
                  Exporter l'agent
                {:else}
                  <div class="flex items-center">
                    <button
                      on:click={handleBack}
                      class="mr-2 p-1 rounded-full hover:bg-gray-100"
                      aria-label="Retour"
                    >
                      <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span>Exporter en {exportFormats.find(f => f.id === selectedFormat)?.name}</span>
                  </div>
                {/if}
              </h3>
              
              <div class="mt-4">
                {#if !selectedFormat}
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {#each exportFormats as format}
                      {#if agent.exportFormats?.includes(format.id as ExportPlatform)}
                        <button
                          on:click={() => generateExport(format.id as ExportPlatform)}
                          class="relative bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col items-center text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          disabled={isLoading}
                        >
                          <span class="text-2xl mb-2">{format.icon}</span>
                          <span class="font-medium text-gray-900">{format.name}</span>
                          <span class="text-sm text-gray-500">{format.description}</span>
                        </button>
                      {/if}
                    {/each}
                  </div>
                {:else if isLoading}
                  <div class="flex justify-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                {:else if error}
                  <div class="bg-red-50 border-l-4 border-red-400 p-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                {:else}
                  <div class="space-y-4">
                    <div class="relative
                      bg-gray-50 p-4 rounded-lg border border-gray-200
                      font-mono text-sm overflow-auto max-h-64">
                      <pre class="whitespace-pre-wrap break-words">{exportContent}</pre>
                    </div>
                    <div class="flex justify-end space-x-3">
                      <button
                        on:click|preventDefault={handleCopyToClipboard}
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                        Copier
                      </button>
                      <button
                        on:click={handleDownload}
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        Télécharger
                      </button>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            on:click={closeModal}
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
