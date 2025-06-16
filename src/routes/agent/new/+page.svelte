<script lang="ts">
  import AgentCreator from '$lib/components/agent-creator/AgentCreator.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { AgentTemplate, AgentConfiguration } from '$lib/types/agent';

  // Exemple de modèles d'agents prédéfinis
  const templates: AgentTemplate[] = [
    {
      id: 'linkedin-ghostwriter',
      name: 'Rédacteur LinkedIn',
      description: 'Crée des publications LinkedIn engageantes et professionnelles',
      category: 'Rédaction',
      tags: ['réseaux sociaux', 'contenu', 'marketing'],
      defaultPrompt: `Tu es un expert en rédaction pour LinkedIn. Ton rôle est de créer des publications engageantes qui mettent en valeur l'expertise de l'utilisateur. Les publications doivent être professionnelles, inspirantes et inciter à l'engagement. Utilise des appels à l'action clairs et des questions pour stimuler les commentaires.`,
      icon: '📝'
    },
    {
      id: 'pdf-summarizer',
      name: 'Résumeur de PDF',
      description: 'Extrait les points clés des documents PDF',
      category: 'Productivité',
      tags: ['document', 'résumé', 'analyse'],
      defaultPrompt: `Tu es un assistant qui aide à résumer des documents PDF. Ton rôle est d'extraire les informations les plus importantes et de les présenter de manière claire et concise. Inclus les points clés, les données importantes et les conclusions. Si le document contient des sections, organise ton résumé de manière similaire.`,
      icon: '📄'
    },
    {
      id: 'seo-assistant',
      name: 'Assistant SEO',
      description: 'Optimise le contenu pour le référencement',
      category: 'Marketing',
      tags: ['référencement', 'contenu', 'web'],
      defaultPrompt: `Tu es un expert en SEO. Analyse le contenu fourni et propose des améliorations pour optimiser son référencement. Inclus des suggestions de mots-clés, des conseils sur la structure, les balises méta et d'autres optimisations techniques. Explique pourquoi chaque suggestion est importante pour le référencement.`,
      icon: '🔍'
    }
  ];

  async function handleSave(agentConfig: AgentConfiguration) {
    try {
      // Ici, nous allons implémenter la sauvegarde de l'agent
      // Pour l'instant, nous allons simplement rediriger vers la page de l'agent
      await goto(`/agent/${agentConfig.id}`);
    } catch (error) {
      console.error('Erreur lors de la création de l\'agent:', error);
      // Gérer l'erreur (afficher un message à l'utilisateur, etc.)
    }
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="text-center mb-10">
    <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
      Créer un nouvel agent IA
    </h1>
    <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
      Sélectionnez un modèle ou créez un agent personnalisé
    </p>
  </div>
  
  <div class="bg-white shadow rounded-lg p-6">
    <AgentCreator 
      {templates} 
      onSave={handleSave}
    />
  </div>
</div>
