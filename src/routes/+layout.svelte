<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let { children } = $props();
  let mobileMenuOpen = $state(false);
  
  // Fermer le menu mobile lors du changement de page
  $effect(() => {
    if ($page.url) {
      mobileMenuOpen = false;
    }
  });
  
  // Gérer la fermeture du menu au clic en dehors
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.mobile-menu-button') && !target.closest('.mobile-menu')) {
      mobileMenuOpen = false;
    }
    event.stopPropagation();
  }
  
  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Barre de navigation -->
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-blue-600">AgentFabric</span>
          </a>
        </div>
        
        <!-- Navigation desktop -->
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a 
            href="/" 
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium { $page.url.pathname === '/' ? 'border-blue-500 text-gray-900' : '' }"
          >
            Accueil
          </a>
          <a 
            href="/agent/new" 
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium { $page.url.pathname.startsWith('/agent') ? 'border-blue-500 text-gray-900' : '' }"
          >
            Créer un agent
          </a>
        </div>
        
        <!-- Bouton menu mobile -->
        <div class="-mr-2 flex items-center sm:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onclick={toggleMenu}
            aria-expanded="false"
            class:mobile-menu-button={true}
          >
            <span class="sr-only">Ouvrir le menu principal</span>
            {#if mobileMenuOpen}
              <!-- Icone X -->
              <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            {:else}
              <!-- Icone menu -->
              <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Menu mobile -->
    {#if mobileMenuOpen}
      <div class="sm:hidden mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
          <a 
            href="/" 
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium { $page.url.pathname === '/' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700' }"
          >
            Accueil
          </a>
          <a 
            href="/agent/new" 
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium { $page.url.pathname.startsWith('/agent') ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700' }"
          >
            Créer un agent
          </a>
        </div>
      </div>
    {/if}
  </nav>

  <!-- Contenu principal -->
  <main class="py-10">
    {@render children()}
  </main>

  <!-- Pied de page -->
  <footer class="bg-white border-t border-gray-200 mt-12">
    <div class="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
      <p class="text-center text-base text-gray-500">
        &copy; 2025 AgentFabric. Tous droits réservés.
      </p>
    </div>
  </footer>
</div>
