<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import AgentExporter from '$lib/components/agent-exporter/AgentExporter.svelte';
  import type { PageData } from './$types';
  import type { AgentConfiguration } from '$lib/types/agent';

  export let data: PageData;
  
  let agent: AgentConfiguration | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(() => {
    if (data.agent) {
      agent = data.agent;
    } else {
      error = 'Agent non trouvé';
      // Redirect to the agent list if no agent data is available
      goto('/agent');
    }
    loading = false;
  });

  function handleClose() {
    goto(`/agent/${$page.params.id}`);
  }
</script>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  {#if loading}
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement de l'agent...</p>
    </div>
  {:else if error}
    <div class="bg-red-50 border-l-4 border-red-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  {:else if agent}
    <div class="px-4 py-6 sm:px-0">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Exporter l'agent
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Choisissez un format d'export pour l'agent "{agent.name}"
          </p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            {#if agent}
              <AgentExporter 
                agent={agent}
                isOpen={true} 
                onClose={handleClose} 
              />
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
