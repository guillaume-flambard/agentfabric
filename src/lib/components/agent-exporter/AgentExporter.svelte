<script lang="ts">
  import { downloadFile, copyToClipboard } from '$lib/utils/file';
  import { fade } from 'svelte/transition';
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { generateAgentExport } from '$lib/utils/export-generator';
  import type { AgentConfiguration, ExportPlatform } from '$lib/types/agent';
  
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

  // Gestion de la fermeture de la modale
  function closeModal() {
    if (isLoading) return; // Empêche la fermeture pendant le chargement
    selectedFormat = null;
    exportContent = '';
    onClose();
  }

  // Gestion du retour à la sélection de format
  function handleBack() {
    selectedFormat = null;
    exportContent = '';
    error = null;
  }

  // Gestion de la navigation au clavier
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (isLoading) return; // Ne rien faire pendant le chargement
      
      if (selectedFormat) {
        handleBack();
      } else {
        closeModal();
      }
      event.preventDefault();
      event.stopPropagation();
    }
    // Navigation par onglet dans la modale
    else if (event.key === 'Tab' && selectedFormat) {
      const focusableElements = Array.from(
        document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  // Gestion du clic en dehors de la modale
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
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
    on:click|self={handleBackdropClick}
    on:keydown={handleKeyDown}
    transition:fade={{ duration: 150 }}
  >
    <div class="flex min-h-screen items-center justify-center p-4 text-center">
      <div class="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true"></div>
      
      <div
        class="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
        in:fly={{ y: 20, duration: 200, easing: quintOut }}
        out:fly={{ y: -20, duration: 150, easing: quintOut }}
      >
        <!-- En-tête -->
        <div class="border-b border-gray-200 px-6 py-4">
          <div class="flex items-center">
            {#if selectedFormat}
              <button
                on:click|stopPropagation={handleBack}
                class="mr-3 -ml-2 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Retour à la sélection du format"
                title="Retour"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span class="sr-only">Retour</span>
              </button>
            {/if}
            <h3 class="text-lg font-medium text-gray-900">
              {!selectedFormat ? "Exporter l'agent" : `Exporter en ${exportFormats.find(f => f.id === selectedFormat)?.name}`}
            </h3>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="px-6 py-4">
          {#if !selectedFormat}
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {#each exportFormats as format}
                {#if agent.exportFormats?.includes(format.id as ExportPlatform)}
                  <button
                    on:click={() => generateExport(format.id as ExportPlatform)}
                    class="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={isLoading}
                  >
                    <span class="mb-2 text-2xl">{format.icon}</span>
                    <span class="font-medium text-gray-900">{format.name}</span>
                    <span class="mt-1 text-sm text-gray-500">{format.description}</span>
                  </button>
                {/if}
              {/each}
            </div>
          
          {:else if isLoading}
            <div class="flex justify-center py-8">
              <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            </div>
          
          {:else if error}
            <div class="rounded-md bg-red-50 p-4">
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
              <div class="max-h-96 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm">
                <pre class="whitespace-pre-wrap break-words">{exportContent}</pre>
              </div>
              
              <div class="flex justify-end space-x-3 pt-2">
                <button
                  on:click|preventDefault={handleCopyToClipboard}
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg class="mr-2 -ml-1 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copier
                </button>
                <button
                  on:click={handleDownload}
                  class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  Télécharger
                </button>
              </div>
            </div>
          {/if}
        </div>

        <!-- Pied de page -->
        <div class="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div class="flex justify-end">
            <button
              type="button"
              on:click={closeModal}
              class="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
