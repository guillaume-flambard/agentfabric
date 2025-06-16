<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import type { AgentConfiguration } from '$lib/types/agent';

  export let data: PageData;
  
  let agent: AgentConfiguration | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      // Dans une application réelle, on récupérerait l'agent depuis une API
      // Pour l'instant, on utilise les données passées en props
      if (data.agent) {
        agent = data.agent;
      } else {
        error = 'Agent non trouvé';
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'agent:', err);
      error = 'Une erreur est survenue lors du chargement de l\'agent';
    } finally {
      loading = false;
    }
  });
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {#if loading}
    <div class="flex justify-center py-12">
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
  {:else if agent}
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {agent.name}
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            {agent.description}
          </p>
        </div>
        {#if agent}
          <div class="flex space-x-3">
            <button
              on:click={() => agent && goto(`/agent/${agent.id}/edit`)}
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Modifier
            </button>
            <button
              on:click={() => agent && goto(`/agent/${agent.id}/export`)}
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Exporter
            </button>
          </div>
        {/if}
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">ID</dt>
            <dd class="mt-1 text-sm text-gray-900">{agent.id}</dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Modèle</dt>
            <dd class="mt-1 text-sm text-gray-900">{agent.templateId}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Prompt système</dt>
            <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md font-mono">
              {agent.prompt}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  {/if}
</div>
