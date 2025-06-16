import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration des chemins pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please make sure you have the following in your .env.local file:');
  console.log('PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('🌱 Début du seed de la base de données...');

    // 1. Vérifier la connexion à Supabase
    console.log('🔌 Vérification de la connexion à Supabase...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Erreur de connexion à Supabase:', authError.message);
      return;
    }
    
    console.log('✅ Connecté à Supabase avec succès!');

    // 2. Vérifier si les tables existent
    console.log('🔍 Vérification des tables...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables')
      .select('*');

    if (tablesError) {
      console.warn('⚠️ Impossible de récupérer la liste des tables, poursuite du script...');
    } else {
      console.log('📋 Tables existantes:', tables.map(t => t.tablename).join(', '));
    }

    // 3. Insérer les formats d'exportation
    console.log('📝 Insertion des formats d\'exportation...');
    const exportFormats = [
      { id: 'n8n', name: 'n8n', description: 'Format pour n8n', file_extension: 'json', icon: 'n8n' },
      { id: 'make', name: 'Make (Integromat)', description: 'Format pour Make (anciennement Integromat)', file_extension: 'json', icon: 'make' },
      { id: 'nodejs', name: 'Node.js', description: 'Format pour Node.js', file_extension: 'js', icon: 'nodejs' },
      { id: 'rest', name: 'REST API', description: 'Format pour appel API REST', file_extension: 'json', icon: 'rest' },
      { id: 'ollama', name: 'Ollama', description: 'Format pour Ollama', file_extension: 'json', icon: 'ollama' },
    ];

    // Supprimer les formats existants
    await supabase.from('export_formats').delete().neq('id', '');
    
    // Insérer les nouveaux formats
    const { error: exportFormatsError } = await supabase
      .from('export_formats')
      .insert(exportFormats);

    if (exportFormatsError) {
      console.error('❌ Erreur lors de l\'insertion des formats d\'exportation:', exportFormatsError);
      return;
    }
    console.log('✅ Formats d\'exportation insérés avec succès!');

    // 4. Insérer les modèles d'agents
    console.log('🤖 Insertion des modèles d\'agents...');
    
    // Fonction pour générer un UUID v4
    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    const templates = [
      {
        id: uuidv4(),
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
        id: uuidv4(),
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
        id: uuidv4(),
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

    // Supprimer les modèles existants
    await supabase.from('agent_template_export_formats').delete().neq('id', 0);
    await supabase.from('agent_templates').delete().neq('id', '');

    // Traiter chaque modèle
    for (const template of templates) {
      console.log(`\n🔄 Traitement du modèle: ${template.name}...`);
      
      const { export_formats, ...templateData } = template;
      
      try {
        // Utiliser upsert pour insérer ou mettre à jour le modèle
        const { data: upsertedTemplate, error: upsertError } = await supabase
          .from('agent_templates')
          .upsert(
            { ...templateData, updated_at: new Date().toISOString() },
            { 
              onConflict: 'template_id',
              ignoreDuplicates: false
            }
          )
          .select()
          .single();
          
        if (upsertError) {
          throw new Error(`Échec de l'upsert: ${upsertError.message}`);
        }
        
        const templateId = upsertedTemplate.id;
        console.log(`✅ Modèle "${template.name}" traité avec succès!`);
        
        // Gérer les formats d'exportation
        if (export_formats && export_formats.length > 0) {
          // Supprimer les anciennes associations
          const { error: deleteError } = await supabase
            .from('agent_template_export_formats')
            .delete()
            .eq('template_id', templateId);
            
          if (deleteError) {
            console.error(`⚠️ Erreur lors de la suppression des anciens formats: ${deleteError.message}`);
          }
          
          // Créer les nouvelles associations
          const templateFormats = export_formats.map(format => ({
            template_id: templateId,
            format_id: format
          }));

          const { error: formatError } = await supabase
            .from('agent_template_export_formats')
            .insert(templateFormats);

          if (formatError) {
            console.error(`⚠️ Erreur lors de la liaison des formats: ${formatError.message}`);
          } else {
            console.log(`🔗 ${export_formats.length} formats liés au modèle "${template.name}"`);
          }
        }
        
      } catch (error) {
        console.error(`❌ Erreur lors du traitement du modèle ${template.name}:`, error.message);
      }  
    }

    console.log('\n✅ Seed terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  } finally {
    // Fermer la connexion
    await supabase.auth.signOut();
  }
}

// Exécuter le script
seedDatabase().then(() => process.exit(0));
