<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { AgentConfiguration } from '$lib/types/agent';

	export let data: PageData & { agent: AgentConfiguration };

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
			console.error("Erreur lors du chargement de l'agent:", err);
			error = "Une erreur est survenue lors du chargement de l'agent";
		} finally {
			loading = false;
		}
	});
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	{#if loading}
		<div class="flex justify-center py-12">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
		</div>
	{:else if error}
		<div class="border-l-4 border-red-400 bg-red-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm text-red-700">{error}</p>
				</div>
			</div>
		</div>
	{:else if agent}
		<div class="overflow-hidden bg-white shadow sm:rounded-lg">
			<div class="flex items-center justify-between px-4 py-5 sm:px-6">
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
							class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
						>
							Modifier
						</button>
						<button
							on:click={() => agent && goto(`/agent/${agent.id}/export`)}
							class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
						>
							Exporter
						</button>
					</div>
				{/if}
			</div>
			<div class="border-t border-gray-200 px-4 py-5 sm:px-6">
				<dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<!-- Informations de base -->
					<div class="sm:col-span-1">
						<dt class="text-sm font-medium text-gray-500">ID</dt>
						<dd class="mt-1 font-mono text-sm text-gray-900">{agent.id}</dd>
					</div>

					<div class="sm:col-span-1">
						<dt class="text-sm font-medium text-gray-500">Modèle</dt>
						<dd class="mt-1 text-sm text-gray-900">{agent.model || 'Non spécifié'}</dd>
					</div>

					<div class="sm:col-span-1">
						<dt class="text-sm font-medium text-gray-500">Date de création</dt>
						<dd class="mt-1 text-sm text-gray-900">
							{new Date(agent.createdAt).toLocaleDateString('fr-FR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</dd>
					</div>

					{#if agent.exportFormats && agent.exportFormats.length > 0}
						<div class="sm:col-span-1">
							<dt class="text-sm font-medium text-gray-500">Formats d'export</dt>
							<dd class="mt-1">
								<div class="flex flex-wrap gap-2">
									{#each agent.exportFormats as format}
										<span
											class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
										>
											{format}
										</span>
									{/each}
								</div>
							</dd>
						</div>
					{/if}

					<!-- Section du prompt système -->
					<div class="sm:col-span-2">
						<dt class="flex items-center justify-between text-sm font-medium text-gray-500">
							<span>Prompt système</span>
							<span class="text-xs font-normal text-gray-400"
								>{agent.prompt ? agent.prompt.length : 0} caractères</span
							>
						</dt>
						<dd class="mt-1">
							{#if agent.prompt}
								<div class="relative">
									<pre
										class="max-h-96 overflow-x-auto rounded-md bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap text-gray-900">
                    {agent.prompt}
                  </pre>
									<button
										on:click={() => {
											if (agent?.prompt) {
												navigator.clipboard.writeText(agent.prompt);
												// Ici vous pourriez ajouter une notification de succès
											}
										}}
										class="absolute top-2 right-2 rounded-md bg-white p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none"
										title="Copier le prompt"
										aria-label="Copier le prompt dans le presse-papiers"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
											/>
										</svg>
									</button>
								</div>
							{:else}
								<p class="text-sm text-gray-500 italic">Aucun prompt défini</p>
							{/if}
						</dd>
					</div>

					<!-- Métadonnées supplémentaires -->
					{#if Object.keys(agent).some((key) => key.startsWith('metadata'))}
						<div class="sm:col-span-2">
							<dt class="text-sm font-medium text-gray-500">Métadonnées</dt>
							<dd class="mt-1">
								<pre class="overflow-x-auto rounded-md bg-gray-50 p-3 text-xs text-gray-500">
                  {JSON.stringify(agent.metadata, null, 2)}
                </pre>
							</dd>
						</div>
					{/if}
				</dl>
			</div>
		</div>
	{/if}
</div>
