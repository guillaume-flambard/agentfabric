<script lang="ts">
  export let data: { agents: Array<{
    id: string;
    name: string;
    description: string;
    model: string;
    createdAt: Date;
    updatedAt: Date;
    exportFormats: string[];
  }> };
  
  $: agents = data.agents || [];
</script>

<!-- Hero Section -->
<div class="bg-white">
  <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        <span class="block">Créez des agents IA</span>
        <span class="block text-blue-600">en quelques clics</span>
      </h1>
      <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        AgentFabric vous permet de générer des agents IA personnalisés et de les déployer facilement sur votre plateforme préférée.
      </p>
      <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        <div class="rounded-md shadow">
          <a href="/agent/new" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
            Créer un agent
          </a>
        </div>
        <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
          <a href="#features" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
            En savoir plus
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Features Section -->
<div id="features" class="py-12 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:text-center">
      <h2 class="text-base text-blue-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
      <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Une nouvelle façon de créer des agents IA
      </p>
      <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
        AgentFabric simplifie la création et le déploiement d'agents IA personnalisés.
      </p>
    </div>

    <div class="mt-10">
      <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
        <!-- Feature 1 -->
        <div class="relative">
          <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <!-- Heroicon name: outline/lightning-bolt -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="ml-16">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Rapide et simple</h3>
            <p class="mt-2 text-base text-gray-500">
              Créez des agents IA en quelques minutes sans avoir besoin de compétences techniques avancées.
            </p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="relative">
          <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <!-- Heroicon name: outline/refresh -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div class="ml-16">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Export multi-plateforme</h3>
            <p class="mt-2 text-base text-gray-500">
              Exportez vos agents vers n8n, Make.com, Node.js, API REST, Ollama et plus encore.
            </p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="relative">
          <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <!-- Heroicon name: outline/cog -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="ml-16">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Personnalisation avancée</h3>
            <p class="mt-2 text-base text-gray-500">
              Personnalisez chaque aspect de vos agents avec des prompts et des paramètres avancés.
            </p>
          </div>
        </div>

        <!-- Feature 4 -->
        <div class="relative">
          <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <!-- Heroicon name: outline/shield-check -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="ml-16">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Sécurisé et fiable</h3>
            <p class="mt-2 text-base text-gray-500">
              Vos données restent privées et vos agents sont déployés de manière sécurisée.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Liste des agents -->
<div class="py-12 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:text-center mb-12">
      <h2 class="text-base text-blue-600 font-semibold tracking-wide uppercase">Vos agents</h2>
      <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Gérer vos agents IA
      </p>
      <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
        Consultez et gérez tous vos agents créés
      </p>
    </div>

    {#if agents.length === 0}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun agent</h3>
        <p class="mt-1 text-sm text-gray-500">Commencez par créer votre premier agent IA.</p>
        <div class="mt-6">
          <a href="/agent/new" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Nouvel agent
          </a>
        </div>
      </div>
    {:else}
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each agents as agent}
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <h3 class="text-lg font-medium text-gray-900">
                    <a href={`/agent/${agent.id}`} class="hover:text-blue-600">
                      {agent.name}
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500 truncate">{agent.description || 'Aucune description'}</p>
                </div>
              </div>
              <div class="mt-4">
                <div class="flex items-center text-sm text-gray-500">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {agent.model}
                  </span>
                  {#if agent.exportFormats.length > 0}
                    <span class="ml-2">•</span>
                    <div class="ml-2 flex space-x-1">
                      {#each agent.exportFormats as format}
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {format}
                        </span>
                      {/each}
                    </div>
                  {/if}
                </div>
                <div class="mt-2 text-sm text-gray-500">
                  Créé le {agent.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <a href={`/agent/${agent.id}`} class="font-medium text-blue-600 hover:text-blue-500">
                  Voir les détails<span class="sr-only">, {agent.name}</span>
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="mt-8 text-center">
        <a href="/agent/new" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Créer un nouvel agent
        </a>
      </div>
    {/if}
  </div>
</div>

<!-- CTA Section -->
<div class="bg-blue-700">
  <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
      <span class="block">Prêt à créer votre premier agent ?</span>
      <span class="block">Commencez dès maintenant.</span>
    </h2>
    <div class="mt-8 flex justify-center">
      <div class="inline-flex rounded-md shadow">
        <a href="/agent/new" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
          Créer un agent
        </a>
      </div>
    </div>
  </div>
</div>
