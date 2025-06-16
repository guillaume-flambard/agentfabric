import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Début du seed de la base de données...');

  // 1. Vider les tables existantes (attention en production!)
  console.log('🧹 Nettoyage des tables existantes...');
  await supabase.from('agent_template_export_formats').delete().neq('id', 0);
  await supabase.from('agent_export_formats').delete().neq('id', 0);
  await supabase.from('export_formats').delete().neq('id', '');
  await supabase.from('agents').delete().neq('id', '');
  await supabase.from('agent_templates').delete().neq('id', '');

  // 2. Insérer les formats d'exportation
  console.log('📝 Insertion des formats d\'exportation...');
  const exportFormats = [
    { id: 'n8n', name: 'n8n', description: 'Format pour n8n', file_extension: 'json', icon: 'n8n' },
    { id: 'make', name: 'Make (Integromat)', description: 'Format pour Make (anciennement Integromat)', file_extension: 'json', icon: 'make' },
    { id: 'nodejs', name: 'Node.js', description: 'Format pour Node.js', file_extension: 'js', icon: 'nodejs' },
    { id: 'rest', name: 'REST API', description: 'Format pour appel API REST', file_extension: 'json', icon: 'rest' },
    { id: 'ollama', name: 'Ollama', description: 'Format pour Ollama', file_extension: 'json', icon: 'ollama' },
  ];

  const { error: exportFormatsError } = await supabase
    .from('export_formats')
    .insert(exportFormats);

  if (exportFormatsError) {
    console.error('Erreur lors de l\'insertion des formats d\'exportation:', exportFormatsError);
    return;
  }

  // 3. Insérer les modèles d'agents
  console.log('🤖 Insertion des modèles d\'agents...');
  const templates = [
    {
      id: 'linkedin-ghostwriter',
      name: 'Rédacteur LinkedIn',
      description: 'Crée des publications LinkedIn engageantes et professionnelles',
      category: 'Rédaction',
      tags: ['réseaux sociaux', 'contenu', 'marketing'],
      default_prompt: 'Tu es un expert en rédaction pour LinkedIn. Ton rôle est de créer des publications engageantes qui mettent en valeur l\'expertise de l\'utilisateur. Les publications doivent être professionnelles, inspirantes et inciter à l\'engagement. Utilise des appels à l\'action clairs et des questions pour stimuler les commentaires.',
      icon: '📝',
      model: 'gpt-4',
      prompt: 'Tu es un expert en rédaction pour LinkedIn. Ton rôle est de créer des publications engageantes qui mettent en valeur l\'expertise de l\'utilisateur. Les publications doivent être professionnelles, inspirantes et inciter à l\'engagement. Utilise des appels à l\'action clairs et des questions pour stimuler les commentaires.',
      template_id: 'linkedin-ghostwriter',
      export_formats: ['n8n', 'make', 'nodejs', 'rest']
    },
    {
      id: 'pdf-summarizer',
      name: 'Résumeur de PDF',
      description: 'Extrait les points clés des documents PDF',
      category: 'Productivité',
      tags: ['document', 'résumé', 'analyse'],
      default_prompt: 'Tu es un assistant qui aide à résumer des documents PDF. Ton rôle est d\'extraire les informations les plus importantes et de les présenter de manière claire et concise. Inclus les points clés, les données importantes et les conclusions. Si le document contient des sections, organise ton résumé de manière similaire.',
      icon: '📄',
      model: 'gpt-4',
      prompt: 'Tu es un assistant qui aide à résumer des documents PDF. Ton rôle est d\'extraire les informations les plus importantes et de les présenter de manière claire et concise. Inclus les points clés, les données importantes et les conclusions. Si le document contient des sections, organise ton résumé de manière similaire.',
      template_id: 'pdf-summarizer',
      export_formats: ['n8n', 'make', 'nodejs', 'ollama']
    },
    {
      id: 'seo-assistant',
      name: 'Assistant SEO',
      description: 'Optimise le contenu pour le référencement',
      category: 'Marketing',
      tags: ['référencement', 'contenu', 'web'],
      default_prompt: 'Tu es un expert en SEO. Analyse le contenu fourni et propose des améliorations pour optimiser son référencement. Inclus des suggestions de mots-clés, des conseils sur la structure, les balises méta et d\'autres optimisations techniques. Explique pourquoi chaque suggestion est importante pour le référencement.',
      icon: '🔍',
      model: 'gpt-4',
      prompt: 'Tu es un expert en SEO. Analyse le contenu fourni et propose des améliorations pour optimiser son référencement. Inclus des suggestions de mots-clés, des conseils sur la structure, les balises méta et d\'autres optimisations techniques. Explique pourquoi chaque suggestion est importante pour le référencement.',
      template_id: 'seo-assistant',
      export_formats: ['n8n', 'make', 'nodejs', 'rest', 'ollama']
    }
  ];

  // Insérer les modèles
  for (const template of templates) {
    const { export_formats, ...templateData } = template;
    
    // Insérer le modèle
    const { data: insertedTemplate, error: templateError } = await supabase
      .from('agent_templates')
      .insert(templateData)
      .select()
      .single();

    if (templateError) {
      console.error(`Erreur lors de l'insertion du modèle ${template.name}:`, templateError);
      continue;
    }

    // Lier les formats d'exportation
    if (export_formats && export_formats.length > 0) {
      const templateFormats = export_formats.map(format => ({
        template_id: insertedTemplate.id,
        format_id: format
      }));

      const { error: formatError } = await supabase
        .from('agent_template_export_formats')
        .insert(templateFormats);

      if (formatError) {
        console.error(`Erreur lors de la liaison des formats pour ${template.name}:`, formatError);
      }
    }
  }

  console.log('✅ Seed terminé avec succès!');
}

seedDatabase()
  .catch(console.error)
  .finally(() => process.exit(0));
